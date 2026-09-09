/**
 * WhatsApp Confirmation Deep Linking & Formatting Utility
 * Uses official WhatsApp click-to-chat (https://wa.me/...) deep links.
 */

export interface WhatsAppMessageData {
  participantName: string;
  eventName: string;
  registrationNumber: string;
  bibNumber: string;
  distance: string;
  eventDate: string;
  venue: string;
  organizerName: string;
  passLink?: string;
  appLink?: string;
}

export const SANATAN_DHAM_APP_URL =
  "https://play.google.com/store/apps/details?id=com.aiwazir.sanatan.app";

export const DEFAULT_WHATSAPP_TEMPLATE = `Hello {Participant Name},

Congratulations! 🎉

Your registration for the {Event Name} has been successfully confirmed.

Registration Details:
• Registration No.: {Registration Number}
• Bib No.: {Bib Number}
• Race: {Distance}
• Event Date: {Event Date}
• Venue: {Venue}

Your payment has been successfully verified.

View Digital Pass:
{Pass Link}

Download Sanatan Dham App (1 Month Free Access):
{App Link}

Please keep this message for your records and bring your registration/Bib details on event day.

Thank you for participating.

Best wishes,
{Organizer Name}`;

/**
 * Normalizes a phone number for WhatsApp deep-linking.
 * Handles Indian numbers by prefixing 91 if a 10-digit number is provided.
 * Strips out whitespace, dashes, leading zeroes, and plus signs.
 */
export function normalizeIndianPhoneNumber(rawMobile: string | null | undefined): {
  valid: boolean;
  normalized?: string;
  error?: string;
} {
  if (!rawMobile || typeof rawMobile !== "string") {
    return {
      valid: false,
      error: "Valid mobile number is required to send WhatsApp confirmation.",
    };
  }

  // Remove whitespace, dashes, brackets, and any non-digit except '+'
  let cleaned = rawMobile.trim().replace(/[^\d+]/g, "");

  // Strip leading '+'
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // Strip leading '0's (common in local dialings like 09330126042)
  cleaned = cleaned.replace(/^0+/, "");

  // If 10 digits, assume standard Indian mobile number and prefix '91'
  if (cleaned.length === 10) {
    if (/^[5-9]\d{9}$/.test(cleaned)) {
      return { valid: true, normalized: `91${cleaned}` };
    }
  }

  // If 12 digits starting with '91'
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const national = cleaned.substring(2);
    if (/^[5-9]\d{9}$/.test(national)) {
      return { valid: true, normalized: cleaned };
    }
  }

  // Generic international fallback: between 10 and 15 digits
  if (/^\d{10,15}$/.test(cleaned)) {
    return { valid: true, normalized: cleaned };
  }

  return {
    valid: false,
    error: "Valid mobile number is required to send WhatsApp confirmation.",
  };
}

/**
 * Formats a WhatsApp message by substituting dynamic event and participant placeholders.
 */
export function formatWhatsAppMessage(
  customTemplate: string | null | undefined,
  data: WhatsAppMessageData
): string {
  const template =
    customTemplate && customTemplate.trim().length > 0
      ? customTemplate
      : DEFAULT_WHATSAPP_TEMPLATE;

  return template
    .replace(/{Participant Name}/g, data.participantName)
    .replace(/{Event Name}/g, data.eventName)
    .replace(/{Registration Number}/g, data.registrationNumber)
    .replace(/{Bib Number}/g, data.bibNumber)
    .replace(/{Distance}/g, data.distance)
    .replace(/{Event Date}/g, data.eventDate)
    .replace(/{Venue}/g, data.venue)
    .replace(/{Organizer Name}/g, data.organizerName)
    .replace(/{Pass Link}/g, data.passLink || "https://paryavaranmarathon.nirajpaul.com/lookup")
    .replace(/{App Link}/g, data.appLink || SANATAN_DHAM_APP_URL);
}

/**
 * Builds the official click-to-chat WhatsApp deep link.
 * Properly encodes URL characters including linebreaks (%0A), emojis, and spaces (%20).
 */
export function buildWhatsAppUrl(normalizedPhone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
