/**
 * Generate a unique merchant order ID
 * Max length: 50 characters (Duitku requirement)
 * Format: PT-{timestamp}-{userId_short}-{random}
 *
 * @param userId - User ID (will be shortened if needed)
 * @returns Unique merchant order ID (max 50 chars)
 */
export function generateMerchantOrderId(userId: string): string {
  const timestamp = Date.now().toString().slice(-10);

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  const shortUserId =
    userId.length > 20 ? userId.substring(userId.length - 20) : userId;

  const merchantOrderId = `PT-${timestamp}-${shortUserId}-${random}`;

  if (merchantOrderId.length > 50) {
    return merchantOrderId.substring(0, 50);
  }

  return merchantOrderId;
}

/**
 * Validate merchant order ID format and length
 * @param merchantOrderId - Merchant order ID to validate
 * @returns true if valid, false otherwise
 */
export function validateMerchantOrderId(merchantOrderId: string): boolean {
  if (!merchantOrderId) return false;
  if (merchantOrderId.length > 50) return false;
  if (merchantOrderId.length < 5) return false;

  const validPattern = /^[A-Za-z0-9\-_]+$/;
  return validPattern.test(merchantOrderId);
}
