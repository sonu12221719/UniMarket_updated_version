import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  university: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  profilePic: { type: String },
  paymentInfo: {
    accountNumber: String,
    ifsc: String,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
