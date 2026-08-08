export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  // In a real scenario, this would use Resend, SendGrid, or AWS SES
  console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
  return { success: true };
}
