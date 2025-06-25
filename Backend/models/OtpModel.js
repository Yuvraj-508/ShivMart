// models/OtpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '5m' }, // OTP expires after 5 minutes
  },
});

export default mongoose.model("Otp", otpSchema);
