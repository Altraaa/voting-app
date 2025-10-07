export interface DuitkuPaymentMethodRequest {
  merchantCode: string;
  amount: number;
  datetime: string; // Format: YYYY-MM-DD HH:mm:ss
  signature: string;
}

// Response payment methods
export interface PaymentMethod {
  paymentCode: string;
  paymentName: string;
  paymentImage: string;
  totalFee: {
    flat: number;
    percent: number;
  };
}

export interface DuitkuPaymentMethodResponse {
  paymentFee: PaymentMethod[];
}

// Request untuk create transaction
export interface DuitkuPaymentRequest {
  merchantCode: string;
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  email: string;
  customerVaName: string;
  phoneNumber?: string;
  itemDetails: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  callbackUrl: string;
  returnUrl: string;
  signature: string;
  expiryPeriod: number;
  paymentMethod: string;
}

export interface DuitkuPaymentResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  vaNumber?: string;
  amount: number;
  statusCode: string;
  statusMessage: string;
}

export interface PaymentData {
  merchantOrderId: string;
  paymentAmount: number;
  productDetails: string;
  email: string;
  customerName: string;
  phoneNumber: string;
  paymentMethod: string;
}

export interface PaymentInitiate {
  pointVoteId: string;
  paymentMethod: string;
}

// Untuk menyimpan detail paket sementara
export interface PackageCheckoutData {
  packageId: string;
  amount: number;
  points: number;
  packageName: string;
}
