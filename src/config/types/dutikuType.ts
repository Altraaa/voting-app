
export interface DuitkuPaymentRequest {
  merchantCode: string;
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  email: string;
  customerVaName?: string;
  phoneNumber?: string;
  itemDetails: any[];
  callbackUrl: string;
  returnUrl: string;
  paymentMethod?: string;
  signature: string;
  expiryPeriod?: number;
}

export interface DuitkuPaymentResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  statusCode: string;
  statusMessage: string;
}