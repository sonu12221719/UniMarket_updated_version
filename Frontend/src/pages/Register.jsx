import { useState } from "react";
import api from "../api/axiosConfig.js";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    university: "",
    mobile: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    console.log("Registering user:", form);
    
    try {
      await api.post("/auth/register", form);
      setOtpSent(true);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", {
        email: form.email,
        otp,
      });
      alert("Account verified!");
      // Redirect to login or dashboard after successful verification
      window.location.href = "/dashboard"; // Adjust as needed
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {!otpSent ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <input name="firstName" onChange={handleChange} placeholder="First Name" />
          <input name="lastName" onChange={handleChange} placeholder="Last Name" />
          <input name="email" onChange={handleChange} placeholder="Email" />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" />
          <input name="university" onChange={handleChange} placeholder="University" />
          <input name="mobile" onChange={handleChange} placeholder="Mobile" />
          <button onClick={handleRegister}>Register & Send OTP</button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={handleVerifyOtp}>Verify</button>
        </>
      )}
    </div>
  );
};

export default Register;
