export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  // In a real scenario, this would use Resend, SendGrid, or AWS SES
  
  return { success: true };
}
