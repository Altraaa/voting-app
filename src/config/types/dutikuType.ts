export interface DuitkuPaymentMethodRequest {
  merchantCode: string;
  amount: number;
  datetime: string;
  signature: string;
}

export interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

export interface DuitkuPaymentMethodResponse {
  success: boolean;
  data: {
    paymentFee: PaymentMethod[];
    responseCode: string;
    responseMessage: string;
  };
}

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

export interface PackageCheckoutData {
  packageId: string;
  amount: number;
  points: number;
  packageName: string;
}