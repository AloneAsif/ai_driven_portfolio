/**
 * WhatsApp utility — centralized WhatsApp link generation.
 * Uses NEXT_PUBLIC_WHATSAPP_NUMBER from environment variables.
 * Change the number in .env.local without touching code.
 */

// Get WhatsApp number from env (set in .env.local and Vercel)
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Build a wa.me URL that works on both mobile (opens app) and desktop (opens web.whatsapp.com).
 * The wa.me domain automatically redirects based on platform.
 */
export function buildWhatsAppUrl(message: string): string {
  if (!WHATSAPP_NUMBER) {
    console.warn("NEXT_PUBLIC_WHATSAPP_NUMBER not set in environment");
    return "#";
  }
  // wa.me works universally - mobile opens app, desktop opens web.whatsapp.com
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build WhatsApp URL for a specific offer/package.
 */
export function buildOfferWhatsAppUrl(offer: {
  title: string;
  currency: string;
  price: number;
  billingNote?: string;
  ctaMessage?: string;
}): string {
  const priceStr = `${offer.currency} ${offer.price.toLocaleString()}`;
  const billingNote = offer.billingNote ? ` ${offer.billingNote}` : "";
  const defaultMessage = `Hi! I'm interested in the ${offer.title} package (${priceStr}${billingNote}). Can you share more details?`;
  const message = offer.ctaMessage ?? defaultMessage;
  return buildWhatsAppUrl(message);
}

/**
 * Build WhatsApp URL for general inquiry (used by floating button).
 */
export function buildGeneralWhatsAppUrl(): string {
  const defaultMessage = "Hi! I found your portfolio and wanted to ask about a project.";
  return buildWhatsAppUrl(defaultMessage);
}

/**
 * Get the raw WhatsApp number (for display purposes).
 */
export function getWhatsAppNumber(): string {
  return WHATSAPP_NUMBER;
}

/**
 * Check if WhatsApp is configured.
 */
export function isWhatsAppConfigured(): boolean {
  return Boolean(WHATSAPP_NUMBER);
}