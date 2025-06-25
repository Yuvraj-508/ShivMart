import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ShivMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP for ShivMart is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  };

  transporter.sendMail(mailOptions)
  .then(info => console.log("Mail sent:", info.response))
  .catch(err => console.error("Mail error:", err));
};
