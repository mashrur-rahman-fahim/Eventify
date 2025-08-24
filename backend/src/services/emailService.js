import nodemailer from "nodemailer";

// Validate required environment variables
const validateEmailConfig = () => {
  const required = ["EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM", "FRONTEND_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Create transporter with validation
const createTransporter = () => {
  validateEmailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Email Verification",
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${process.env.FRONTEND_URL}/verify/${token}">Verify Email</a>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error; // Re-throw to let calling code handle it
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your Eventify account. Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. This link will expire in 1 hour.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            ${process.env.FRONTEND_URL}/reset-password/${token}
          </p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw error;
  }
};
