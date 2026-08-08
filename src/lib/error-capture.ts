/**
 * Centralized error reporting and observability for critical flows.
 * Ports the pattern from ascend-daily to life-orderuz.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function recordFailedWebhook(opts: {
  provider: string;
  payload: any;
  error: Error | string;
}) {
  const errorMessage = typeof opts.error === "string" ? opts.error : opts.error.message;
  
  console.error(`[WEBHOOK_FAILURE] Provider: ${opts.provider} | Error: ${errorMessage}`, {
    payload: opts.payload,
  });

  try {
    await supabaseAdmin.from("payment_webhook_failures").insert({
      provider: opts.provider,
      payload: opts.payload,
      error_message: errorMessage,
    });
    
    // In a real production environment, this would also trigger a Telegram/Slack alert.
    // For now, it logs to the database for audit.
  } catch (dbError) {
    console.error("[CRITICAL] Failed to record webhook failure in database", dbError);
  }
}

export function alertCritical(message: string, context: Record<string, any> = {}) {
  console.error(`[CRITICAL_ALERT] ${message}`, context);
  // Implementation for external alerting would go here.
}
