import Stripe from 'stripe';
import axios from 'axios';
import { Logger } from '../utils/Logger';
import { PaymentRepository } from '../repositories/PaymentRepository';

export interface PaymentGateway {
  createPayment(paymentData: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(paymentData: any): Promise<boolean>;
  processRefund(paymentId: string, amount?: number): Promise<RefundResponse>;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerPhone?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  paymentUrl: string;
  status: string;
}

export interface RefundResponse {
  refundId: string;
  amount: number;
  status: string;
}

// Stripe Payment Gateway
export class StripePaymentGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: paymentData.currency.toLowerCase(),
              product_data: {
                name: paymentData.description,
              },
              unit_amount: paymentData.amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: paymentData.successUrl || `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: paymentData.cancelUrl || `${process.env.FRONTEND_URL}/booking/cancel`,
        customer_email: paymentData.customerEmail,
        metadata: {
          bookingId: paymentData.bookingId,
        },
      });

      return {
        paymentId: session.id,
        paymentUrl: session.url!,
        status: 'pending'
      };
    } catch (error) {
      Logger.error('Stripe payment creation failed:', error);
      throw new Error('Payment creation failed');
    }
  }

  async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session.payment_status === 'paid';
    } catch (error) {
      Logger.error('Stripe payment verification failed:', error);
      return false;
    }
  }

  async processRefund(paymentIntentId: string, amount?: number): Promise<RefundResponse> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? amount * 100 : undefined, // Convert to cents
      });

      return {
        refundId: refund.id,
        amount: refund.amount / 100, // Convert back to dollars
        status: refund.status
      };
    } catch (error) {
      Logger.error('Stripe refund failed:', error);
      throw new Error('Refund processing failed');
    }
  }
}

// SSL Commerz Payment Gateway (for Bangladesh)
export class SSLCommerzPaymentGateway implements PaymentGateway {
  private baseUrl: string;
  private storeId: string;
  private storePassword: string;

  constructor() {
    this.baseUrl = process.env.SSLCOMMERZ_SANDBOX === 'true' 
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
    this.storeId = process.env.SSLCOMMERZ_STORE_ID!;
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        total_amount: paymentData.amount,
        currency: paymentData.currency,
        tran_id: `TXN_${paymentData.bookingId}_${Date.now()}`,
        success_url: paymentData.successUrl || `${process.env.BACKEND_URL}/api/payments/sslcommerz/success`,
        fail_url: paymentData.cancelUrl || `${process.env.BACKEND_URL}/api/payments/sslcommerz/fail`,
        cancel_url: paymentData.cancelUrl || `${process.env.BACKEND_URL}/api/payments/sslcommerz/cancel`,
        ipn_url: `${process.env.BACKEND_URL}/api/payments/sslcommerz/ipn`,
        product_name: paymentData.description,
        product_category: 'Entertainment',
        product_profile: 'general',
        cus_name: 'Customer',
        cus_email: paymentData.customerEmail,
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: paymentData.customerPhone || '01700000000',
        shipping_method: 'NO',
        product_amount: paymentData.amount,
        vat: 0,
        discount_amount: 0,
        convenience_fee: 0,
      };

      const response = await axios.post(
        `${this.baseUrl}/gwprocess/v4/api.php`,
        new URLSearchParams(postData).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        return {
          paymentId: response.data.sessionkey,
          paymentUrl: response.data.GatewayPageURL,
          status: 'pending'
        };
      } else {
        throw new Error(response.data.failedreason || 'Payment initiation failed');
      }
    } catch (error) {
      Logger.error('SSL Commerz payment creation failed:', error);
      throw new Error('Payment creation failed');
    }
  }

  async verifyPayment(paymentData: any): Promise<boolean> {
    try {
      const { val_id, store_id, store_passwd } = paymentData;

      const response = await axios.get(
        `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
      );

      return response.data.status === 'VALID';
    } catch (error) {
      Logger.error('SSL Commerz payment verification failed:', error);
      return false;
    }
  }

  async processRefund(transactionId: string, amount?: number): Promise<RefundResponse> {
    try {
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        bank_tran_id: transactionId,
        refund_amount: amount?.toString() || '',
        refund_remarks: 'Booking cancellation refund',
        refe_id: `REF_${Date.now()}`,
      };

      const response = await axios.post(
        `${this.baseUrl}/validator/api/merchantTransIDvalidationAPI.php`,
        new URLSearchParams(postData).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        return {
          refundId: response.data.refund_ref_id,
          amount: parseFloat(response.data.refund_amount),
          status: 'processing'
        };
      } else {
        throw new Error('Refund processing failed');
      }
    } catch (error) {
      Logger.error('SSL Commerz refund failed:', error);
      throw new Error('Refund processing failed');
    }
  }
}

// Main Payment Service
export class PaymentService {
  private paymentRepository: PaymentRepository;
  private stripeGateway: StripePaymentGateway;
  private sslcommerzGateway: SSLCommerzPaymentGateway;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.stripeGateway = new StripePaymentGateway();
    this.sslcommerzGateway = new SSLCommerzPaymentGateway();
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Determine payment gateway based on currency or region
      const gateway = this.getPaymentGateway(paymentData.currency);
      
      // Create payment record
      const payment = await this.paymentRepository.create({
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: 'online',
        paymentProvider: gateway.constructor.name,
        status: 'pending'
      });

      // Create payment with gateway
      const paymentResponse = await gateway.createPayment(paymentData);

      // Update payment record with gateway response
      await this.paymentRepository.update(payment.id, {
        transactionId: paymentResponse.paymentId,
        gatewayResponse: paymentResponse
      });

      return paymentResponse;
    } catch (error) {
      Logger.error('Payment creation failed:', error);
      throw error;
    }
  }

  async verifyPayment(paymentData: any): Promise<boolean> {
    try {
      const { bookingId, paymentMethod } = paymentData;
      
      const gateway = paymentMethod === 'stripe' 
        ? this.stripeGateway 
        : this.sslcommerzGateway;

      return await gateway.verifyPayment(paymentData);
    } catch (error) {
      Logger.error('Payment verification failed:', error);
      return false;
    }
  }

  async processRefund(bookingId: string, amount?: number): Promise<RefundResponse> {
    try {
      const payment = await this.paymentRepository.findByBookingId(bookingId);
      if (!payment || !payment.transactionId) {
        throw new Error('Payment not found or transaction ID missing');
      }

      const gateway = payment.paymentProvider === 'StripePaymentGateway'
        ? this.stripeGateway
        : this.sslcommerzGateway;

      const refundResponse = await gateway.processRefund(payment.transactionId, amount);

      // Create refund record
      await this.paymentRepository.create({
        bookingId,
        amount: -refundResponse.amount, // Negative amount for refund
        currency: payment.currency,
        paymentMethod: 'refund',
        paymentProvider: payment.paymentProvider,
        transactionId: refundResponse.refundId,
        status: 'completed'
      });

      return refundResponse;
    } catch (error) {
      Logger.error('Refund processing failed:', error);
      throw error;
    }
  }

  private getPaymentGateway(currency: string): PaymentGateway {
    // Use SSL Commerz for BDT, Stripe for others
    return currency === 'BDT' ? this.sslcommerzGateway : this.stripeGateway;
  }
} 