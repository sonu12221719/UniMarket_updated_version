import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Connect to DB first
connectDB();

console.log("Email:", process.env.EMAIL_USER);
console.log("Pass:", process.env.EMAIL_PASS);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
