import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
    this.initializeSendGrid();
  }

  private initializeTransporter(): void {
    if (process.env.EMAIL_PROVIDER === 'smtp') {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  private initializeSendGrid(): void {
    if (process.env.EMAIL_PROVIDER === 'sendgrid') {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }
  }

  async sendEmail(to: string, subject: string, templateName: string, data: any): Promise<void> {
    try {
      const htmlContent = await this.renderTemplate(templateName, data);

      const emailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@trackmyshow.com',
        to,
        subject,
        html: htmlContent,
      };

      if (process.env.EMAIL_PROVIDER === 'sendgrid') {
        await sgMail.send(emailOptions);
      } else {
        await this.transporter.sendMail(emailOptions);
      }

      Logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      Logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await this.sendEmail(email, 'Verify Your Email - Track My Show', 'email-verification', {
      verificationUrl,
      companyName: 'Track My Show',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@trackmyshow.com'
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await this.sendEmail(email, 'Reset Your Password - Track My Show', 'password-reset', {
      resetUrl,
      companyName: 'Track My Show',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@trackmyshow.com'
    });
  }

  async sendBookingConfirmation(booking: any): Promise<void> {
    await this.sendEmail(
      booking.user.email,
      `Booking Confirmation - ${booking.show.title}`,
      'booking-confirmation',
      {
        userName: `${booking.user.firstName} ${booking.user.lastName}`,
        showTitle: booking.show.title,
        venue: booking.show.venue.name,
        date: booking.schedule.scheduledDate,
        time: booking.schedule.startTime,
        bookingNumber: booking.bookingNumber,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        qrCode: booking.qrCode,
        companyName: 'Track My Show'
      }
    );
  }

  async sendBookingCancellation(booking: any): Promise<void> {
    await this.sendEmail(
      booking.user.email,
      `Booking Cancelled - ${booking.show.title}`,
      'booking-cancellation',
      {
        userName: `${booking.user.firstName} ${booking.user.lastName}`,
        showTitle: booking.show.title,
        bookingNumber: booking.bookingNumber,
        refundAmount: booking.totalAmount,
        currency: booking.currency,
        companyName: 'Track My Show'
      }
    );
  }

  private async renderTemplate(templateName: string, data: any): Promise<string> {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(data);
    } catch (error) {
      Logger.error(`Failed to render email template ${templateName}:`, error);
      throw error;
    }
  }
} 