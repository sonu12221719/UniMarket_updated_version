import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
})

export const sendOtp = async (to, otp) => {
    await transporter.sendMail({
        from:`"UniMarket" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your OTP Code',
        html: `
        <div style="font-family: Arial; padding: 20px;">
            <h2>Email Verification</h2>
            <p>Your OTP code is:</p>
            <h3 style="color: #333;">${otp}</h3>
            <p>This code is valid for 10 minutes.</p>
        </div>
        `,
    })
}