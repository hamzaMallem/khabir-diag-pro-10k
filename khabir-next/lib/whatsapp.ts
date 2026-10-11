import { site } from "@/config/site";

/**
 * Link behind every "Diagnose my car" button.
 * Without a configured number we do NOT send visitors to a generic WhatsApp page that looks like the workshop:
 * the button scrolls to the contact section instead.
 */
export function getWhatsAppHref(message: string): string {
  if (!site.whatsappNumber) return "#rdv";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const isWhatsAppConfigured = site.whatsappNumber !== "";
