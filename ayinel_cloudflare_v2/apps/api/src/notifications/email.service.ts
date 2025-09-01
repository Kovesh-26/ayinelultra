import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: this.configService.get<string>('SENDGRID_API_KEY'),
      },
    });
  }

  async sendMagicLink(email: string, magicLink: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Sign in to Ayinel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to Ayinel!</h1>
          <p>Click the button below to sign in to your account:</p>
          <a href="${magicLink}" 
             style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Sign In to Ayinel
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send magic link email:', error);
      // In production, you might want to log this to a service like Sentry
      throw new Error('Failed to send magic link email');
    }
  }

  async sendWelcomeEmail(email: string, username: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Welcome to Ayinel!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to Ayinel, ${username}!</h1>
          <p>Your account has been created successfully. Start exploring amazing content and connect with creators!</p>
          <a href="${this.configService.get<string>('FRONTEND_URL')}" 
             style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Start Exploring
          </a>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}
