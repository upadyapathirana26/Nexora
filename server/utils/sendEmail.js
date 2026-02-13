// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Nexora" <${process. env.EMAIL_USER}>`,
    to,
    subject: 'Your Nexora Login Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="background: #1E3A8A; color: white; padding: 20px; text-align: center;">
          <h2>Nexora</h2>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hello,</p>
          <p>Your one-time password (OTP) for Nexora is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 8px; color: #1E3A8A;">
              ${otp}
            </span>
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;