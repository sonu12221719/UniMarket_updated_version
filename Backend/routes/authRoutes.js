import express from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, verifyOtp } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/me", protect, getCurrentUser);

export default router;
