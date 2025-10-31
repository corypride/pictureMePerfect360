import nodemailer from 'nodemailer'

export interface BookingDetails {
  name: string
  email: string
  eventDate: string
  eventTime: string
  message?: string
  packageType?: string
  totalPrice?: number
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not configured')
      return false
    }

    try {
      const info = await this.transporter.sendMail({
        from: `${process.env.NEXT_PUBLIC_SITE_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      console.log('Email sent:', info.messageId)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendBookingConfirmation(booking: BookingDetails): Promise<boolean> {
    const subject = `Booking Confirmation - ${process.env.NEXT_PUBLIC_SITE_NAME}`

    const html = this.generateBookingConfirmationHTML(booking)
    const text = this.generateBookingConfirmationText(booking)

    return this.sendEmail({
      to: booking.email,
      subject,
      html,
      text,
    })
  }

  async sendBookingNotification(booking: BookingDetails): Promise<boolean> {
    const adminEmail = process.env.NEXT_PUBLIC_SITE_EMAIL || 'admin@picturemeperfect360.com'
    const subject = `New Booking Request - ${booking.name}`

    const html = this.generateBookingNotificationHTML(booking)
    const text = this.generateBookingNotificationText(booking)

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
      text,
    })
  }

  private generateBookingConfirmationHTML(booking: BookingDetails): string {
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
          .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details h3 { color: #3b82f6; margin-top: 0; }
          .details p { margin: 8px 0; }
          .cta { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .cta:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing ${process.env.NEXT_PUBLIC_SITE_NAME}</p>
        </div>

        <div class="content">
          <p>Hi ${booking.name},</p>
          <p>Thank you for your booking! We're excited to capture your special moments with our 360° photo booth experience.</p>

          <div class="highlight">
            <strong>Important:</strong> Your booking is confirmed, but we'll contact you within 24 hours to finalize details and answer any questions you may have.
          </div>

          <div class="details">
            <h3>Booking Details</h3>
            <p><strong>Event Date:</strong> ${eventDate}</p>
            <p><strong>Event Time:</strong> ${booking.eventTime}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            ${booking.packageType ? `<p><strong>Package:</strong> ${booking.packageType}</p>` : ''}
            ${booking.totalPrice ? `<p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>` : ''}
            ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
          </div>

          <p>What happens next:</p>
          <ul>
            <li>Our team will contact you within 24 hours to confirm details</li>
            <li>We'll discuss setup requirements and event specifics</li>
            <li>You'll receive a final confirmation 48 hours before your event</li>
          </ul>

          <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us:</p>
          <p>
            📧 Email: ${process.env.NEXT_PUBLIC_SITE_EMAIL}<br>
            📞 Phone: [Your Phone Number]
          </p>
        </div>

        <div class="footer">
          <p>${process.env.NEXT_PUBLIC_SITE_NAME} | Creating Unforgettable Memories</p>
          <p>© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }

  private generateBookingConfirmationText(booking: BookingDetails): string {
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return `
BOOKING CONFIRMATION - ${process.env.NEXT_PUBLIC_SITE_NAME}

Hi ${booking.name},

Thank you for your booking! We're excited to capture your special moments with our 360° photo booth experience.

BOOKING DETAILS:
Event Date: ${eventDate}
Event Time: ${booking.eventTime}
Email: ${booking.email}
${booking.packageType ? `Package: ${booking.packageType}` : ''}
${booking.totalPrice ? `Total Price: $${booking.totalPrice.toFixed(2)}` : ''}
${booking.message ? `Special Requests: ${booking.message}` : ''}

IMPORTANT: Your booking is confirmed, but we'll contact you within 24 hours to finalize details and answer any questions you may have.

What happens next:
- Our team will contact you within 24 hours to confirm details
- We'll discuss setup requirements and event specifics
- You'll receive a final confirmation 48 hours before your event

If you have any questions or need to make changes to your booking, please contact us at ${process.env.NEXT_PUBLIC_SITE_EMAIL}.

Thank you for choosing ${process.env.NEXT_PUBLIC_SITE_NAME}!

© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.
    `
  }

  private generateBookingNotificationHTML(booking: BookingDetails): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details h3 { color: #10b981; margin-top: 0; }
          .details p { margin: 8px 0; }
          .urgent { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 New Booking Request</h1>
          <p>Customer booking received</p>
        </div>

        <div class="content">
          <div class="urgent">
            <strong>Action Required:</strong> Please contact the customer within 24 hours to confirm booking details.
          </div>

          <div class="details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Event Time:</strong> ${booking.eventTime}</p>
            ${booking.packageType ? `<p><strong>Package:</strong> ${booking.packageType}</p>` : ''}
            ${booking.totalPrice ? `<p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>` : ''}
            ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
          </div>

          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Contact customer to confirm availability and requirements</li>
            <li>Discuss setup logistics and event details</li>
            <li>Send final booking confirmation</li>
            <li>Add to calendar and schedule preparation</li>
          </ol>
        </div>

        <div class="footer">
          <p>This is an automated notification from ${process.env.NEXT_PUBLIC_SITE_NAME}</p>
        </div>
      </body>
      </html>
    `
  }

  private generateBookingNotificationText(booking: BookingDetails): string {
    return `
NEW BOOKING REQUEST - ${process.env.NEXT_PUBLIC_SITE_NAME}

ACTION REQUIRED: Please contact the customer within 24 hours to confirm booking details.

CUSTOMER INFORMATION:
Name: ${booking.name}
Email: ${booking.email}
Event Date: ${new Date(booking.eventDate).toLocaleDateString()}
Event Time: ${booking.eventTime}
${booking.packageType ? `Package: ${booking.packageType}` : ''}
${booking.totalPrice ? `Total Price: $${booking.totalPrice.toFixed(2)}` : ''}
${booking.message ? `Special Requests: ${booking.message}` : ''}

NEXT STEPS:
1. Contact customer to confirm availability and requirements
2. Discuss setup logistics and event details
3. Send final booking confirmation
4. Add to calendar and schedule preparation
    `
  }
}

export const emailService = new EmailService()