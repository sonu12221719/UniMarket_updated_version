import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtp } from '../utils/emailService.js';

//function to generate otp
function generateOtp(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

//function to register new user
export const registerUser = async (req, res)=>{
    //destructuring the request body
    const {firstName, lastName, email, password, university, mobile} = req.body;

    try {
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        //create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            university,
            mobile,
            otp,
            otpExpiry,
            });

            // Save user FIRST
            const savedUser = await newUser.save();
            console.log("User registered successfully:", savedUser);
        //send otp to user email
        await sendOtp(email, otp);

        // For testing, show OTP in response (in production, send via email/SMS)
        res.status(201).json({
        message: "User registered. Verify OTP.",
        otp, // remove in prod
        userId: savedUser._id,
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//function to verify otp
export const verifyOtp = async (req, res)=>{
    //destructuring the request body
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({message: "User not found"});
        // Check if OTP matches
        if (user.isVerified) return res.status(400).json({ message: "Already verified" });
        // Check if OTP is correct
        if(user.otp !== otp) return res.status(400).json({message: "Invalid OTP"});

        // Check if OTP is expired
        if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });


    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

//function to login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).json({ message: "Account not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get current user
export const getCurrentUser = async (req, res) => {
  // req.user is set by your protect middleware after verifying the token
  res.json({ user: req.user });
};

// Logout user (optional - for server-side logout tracking)
export const logoutUser = async (req, res) => {
  try {
    // In a stateless JWT system, the client handles logout by removing the token
    // This endpoint can be used for logging logout events or invalidating tokens in a blacklist
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
