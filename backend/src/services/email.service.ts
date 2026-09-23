import nodemailer from "nodemailer";

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASSWORD is missing in .env file"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const emailUser = process.env.EMAIL_USER;

  if (!emailUser) {
    throw new Error("EMAIL_USER is missing in .env file");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: emailUser,
    to,
    subject,
    text,
  });

  console.log(`Email sent successfully to ${to}`);
};