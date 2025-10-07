export const DUITKU_CONSTRAINTS = {
  merchantOrderId: {
    maxLength: 50,
    minLength: 1,
    pattern: /^[A-Za-z0-9\-_]+$/,
    description: "Unique order ID from merchant, max 50 characters",
  },

  customerVaName: {
    maxLength: 20,
    minLength: 1,
    description: "Customer name for VA, max 20 characters",
  },

  productDetails: {
    maxLength: 255,
    minLength: 1,
    description: "Product description, max 255 characters",
  },

  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    description: "Valid email format required",
  },

  phoneNumber: {
    pattern: /^(\+62|62|0)[0-9]{9,12}$/,
    examples: ["081234567890", "6281234567890", "+6281234567890"],
    description: "Indonesian phone format, 10-13 digits",
  },

  paymentAmount: {
    min: 10000, 
    max: 500000000,
    description: "Payment amount in IDR, min 10,000",
  },

  expiryPeriod: {
    min: 5, 
    max: 1440, 
    default: 60,
    unit: "minutes",
    description: "Payment expiry in minutes",
  },
} as const;

export function validateDuitkuPaymentData(data: {
  merchantOrderId: string;
  customerVaName: string;
  email: string;
  phoneNumber: string;
  paymentAmount: number;
  productDetails: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (
    data.merchantOrderId.length > DUITKU_CONSTRAINTS.merchantOrderId.maxLength
  ) {
    errors.push(
      `merchantOrderId exceeds ${DUITKU_CONSTRAINTS.merchantOrderId.maxLength} characters`
    );
  }
  if (!DUITKU_CONSTRAINTS.merchantOrderId.pattern.test(data.merchantOrderId)) {
    errors.push("merchantOrderId contains invalid characters");
  }

  if (
    data.customerVaName.length > DUITKU_CONSTRAINTS.customerVaName.maxLength
  ) {
    errors.push(
      `customerVaName exceeds ${DUITKU_CONSTRAINTS.customerVaName.maxLength} characters`
    );
  }

  if (!DUITKU_CONSTRAINTS.email.pattern.test(data.email)) {
    errors.push("Invalid email format");
  }

  if (!DUITKU_CONSTRAINTS.phoneNumber.pattern.test(data.phoneNumber)) {
    errors.push(
      `Invalid phone number format. Use: ${DUITKU_CONSTRAINTS.phoneNumber.examples.join(
        ", "
      )}`
    );
  }

  if (data.paymentAmount < DUITKU_CONSTRAINTS.paymentAmount.min) {
    errors.push(
      `Payment amount must be at least IDR ${DUITKU_CONSTRAINTS.paymentAmount.min.toLocaleString()}`
    );
  }
  if (data.paymentAmount > DUITKU_CONSTRAINTS.paymentAmount.max) {
    errors.push(
      `Payment amount exceeds maximum IDR ${DUITKU_CONSTRAINTS.paymentAmount.max.toLocaleString()}`
    );
  }

  if (
    data.productDetails.length > DUITKU_CONSTRAINTS.productDetails.maxLength
  ) {
    errors.push(
      `productDetails exceeds ${DUITKU_CONSTRAINTS.productDetails.maxLength} characters`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function sanitizeCustomerVaName(name: string): string {
  let sanitized = name.replace(/[^a-zA-Z0-9\s]/g, "");

  sanitized = sanitized.substring(
    0,
    DUITKU_CONSTRAINTS.customerVaName.maxLength
  );

  if (!sanitized.trim()) {
    sanitized = "Customer";
  }

  return sanitized.trim();
}
