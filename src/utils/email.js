import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log("📨 Email sent:", response);
    return response;
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
}
