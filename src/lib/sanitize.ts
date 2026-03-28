/**
 * XSS Prevention & Input Sanitization layer.
 *
 * All user-generated content that reaches the DOM must pass through
 * these functions. We intentionally avoid innerHTML with raw strings.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escapes HTML special characters to prevent XSS when content is
 * rendered inside dangerouslySetInnerHTML (avoid when possible).
 */
export function escapeHtml(input: string): string {
  return String(input).replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/**
 * Strips all HTML tags from a string. Use when you want to accept
 * rich text input but only store/display the plain text.
 */
export function stripTags(input: string): string {
  return String(input).replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes order notes: strips tags, limits length, trims whitespace.
 * Safe to display in text nodes (React escapes these automatically).
 */
export function sanitizeNotes(input: string, maxLength = 300): string {
  return stripTags(input).trim().slice(0, maxLength);
}

/**
 * Sanitizes a coupon code: uppercase, only alphanumeric.
 * Prevents any injection through the coupon field.
 */
export function sanitizeCouponCode(input: string): string {
  return input
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 20);
}

/**
 * Sanitizes a generic text field: strips tags, trims, enforces max length.
 */
export function sanitizeText(input: string, maxLength = 200): string {
  return stripTags(input).trim().slice(0, maxLength);
}

/**
 * Validates that a value is a finite, non-negative number.
 * Guards against NaN, Infinity, and negative prices.
 */
export function isSafePrice(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value >= 0;
}

/**
 * Clamps a quantity to safe bounds to prevent abuse.
 */
export function clampQuantity(quantity: number, min = 1, max = 50): number {
  const safe = Math.round(quantity);
  if (!Number.isInteger(safe) || !isFinite(safe)) return min;
  return Math.min(Math.max(safe, min), max);
}
