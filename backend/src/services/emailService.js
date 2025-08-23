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
