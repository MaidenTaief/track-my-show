import twilio from 'twilio';

export class SMSService {
  private twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: to
      });

      Logger.info(`SMS sent successfully to ${to}`);
    } catch (error) {
      Logger.error(`Failed to send SMS to ${to}:`, error);
      throw error;
    }
  }

  async sendBookingConfirmation(booking: any): Promise<void> {
    const message = `Your booking for "${booking.show.title}" is confirmed! Booking: ${booking.bookingNumber}. Show date: ${booking.schedule.scheduledDate} at ${booking.schedule.startTime}. Venue: ${booking.show.venue.name}. Total: ${booking.totalAmount} ${booking.currency}`;
    
    await this.sendSMS(booking.user.phone, message);
  }

  async sendBookingCancellation(booking: any): Promise<void> {
    const message = `Your booking for "${booking.show.title}" (${booking.bookingNumber}) has been cancelled. Refund of ${booking.totalAmount} ${booking.currency} will be processed within 5-7 business days.`;
    
    await this.sendSMS(booking.user.phone, message);
  }

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    const message = `Your Track My Show verification code is: ${code}. This code expires in 10 minutes.`;
    
    await this.sendSMS(phone, message);
  }

  async sendShowReminder(booking: any): Promise<void> {
    const message = `Reminder: "${booking.show.title}" show today at ${booking.schedule.startTime} at ${booking.show.venue.name}. Show your booking: ${booking.bookingNumber}`;
    
    await this.sendSMS(booking.user.phone, message);
  }
} 