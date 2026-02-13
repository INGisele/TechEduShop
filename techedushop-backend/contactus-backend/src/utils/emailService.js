const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: config.email.auth
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          logger.warn('Email service configuration error:', error);
        } else {
          logger.info('Email service is ready');
        }
      });
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  async sendContactNotification(contactData) {
    try {
      const mailOptions = {
        from: config.email.from,
        to: config.email.adminEmail,
        subject: `New Contact Form Submission - ${contactData.school}`,
        html: this.generateContactEmailTemplate(contactData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Contact notification email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Error sending contact notification email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAutoReply(contactData) {
    try {
      const mailOptions = {
        from: config.email.from,
        to: contactData.email,
        subject: 'Thank you for contacting TechEduShop',
        html: this.generateAutoReplyTemplate(contactData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Auto-reply email sent to ${contactData.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Error sending auto-reply email:', error);
      return { success: false, error: error.message };
    }
  }

  generateContactEmailTemplate(contact) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎓 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Contact Person:</div>
              <div class="value">${contact.name}</div>
            </div>
            <div class="field">
              <div class="label">School Name:</div>
              <div class="value">${contact.school}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
            </div>
            ${contact.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${contact.phone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${contact.message}</div>
            </div>
            <div class="field">
              <div class="label">Submitted:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>TechEduShop4RoboCoders Ltd - Contact Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAutoReplyTemplate(contact) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 TechEduShop</h1>
            <p>Technology Education Partner for Schools</p>
          </div>
          <div class="content">
            <p>Dear ${contact.name},</p>
            <p>Thank you for your interest in TechEduShop! We've received your inquiry regarding <strong>${contact.school}</strong>.</p>
            <p>Our team will review your message and get back to you within 24-48 hours to discuss how we can bring world-class technology education to your students.</p>
            <p>In the meantime, feel free to explore our programs and success stories on our website.</p>
            <a href="https://techedushop.com" class="button">Visit Our Website</a>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our education consultant will contact you within 2 business days</li>
              <li>We'll schedule a visit to your school at your convenience</li>
              <li>You'll receive a customized proposal tailored to your needs</li>
            </ul>
            <p>If you have any urgent questions, please don't hesitate to call us at <strong>+250 788 829 942</strong>.</p>
            <p>Best regards,<br><strong>The TechEduShop Team</strong></p>
          </div>
          <div class="footer">
            <p>📧 Email: info@itc.rw | 📱 Phone: +250 788 829 942</p>
            <p>TechEduShop4RoboCoders Ltd - Building Tomorrow's Innovators Today</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
