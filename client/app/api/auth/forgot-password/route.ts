import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import User from "@/app/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();
    

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "If an account exists, an email was sent." });
    }


    // 1. Generate and Hash Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const email_user = process.env.EMAIL_USER;
    const email_pass = process.env.EMAIL_PASS;
    if (!email_user || !email_pass) {
      console.error("Email credentials are not set in environment variables.");
      return NextResponse.json({ message: "Email service is not configured." }, { status: 500 });
    }
    console.log('Email credentials loaded successfully.', { email_user: email_user, email_pass });
    // 2. Setup Nodemailer Transporter
   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for port 587
  auth: {
    user: email_user,
    pass: email_pass,
  },
});

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password-confirm?token=${resetToken}`;

    // 3. Define Email Content with Professional Design
    const mailOptions = {
      from: `"Trackee Support" <${email_user}>`,
      to: email,
      subject: "🔐 Reset Your Trackee Password",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <div style="background: white; border-radius: 12px; max-width: 600px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Password Reset</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Secure your Trackee account</p>
                  </div>

                  <!-- Body -->
                  <div style="padding: 40px 30px;">
                    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hi there,
                    </p>
                    <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                      We received a request to reset the password for your Trackee account. If this wasn't you, you can safely ignore this email.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">Reset Password</a>
                    </div>

                    <p style="color: #888; font-size: 13px; text-align: center; margin: 30px 0 0 0;">
                      Or copy and paste this link in your browser:
                    </p>
                    <p style="color: #667eea; font-size: 12px; text-align: center; margin: 8px 0; word-break: break-all; font-family: monospace; line-height: 1.4;">
                      ${resetUrl}
                    </p>

                    <!-- Important Info -->
                    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
                      <p style="color: #333; font-size: 14px; margin: 0; font-weight: 600;">⏱️ Link Expiration:</p>
                      <p style="color: #666; font-size: 13px; margin: 5px 0 0 0;">This reset link will expire in <strong>1 hour</strong> for security reasons.</p>
                    </div>

                    <!-- Security Notice -->
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #856404; font-size: 13px; margin: 0;">
                        ⚠️ <strong>Security Tip:</strong> Never share this link with anyone. Trackee will never ask for your password via email.
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #666; font-size: 13px; margin: 0 0 15px 0;">
                      Questions? Contact our support team:
                    </p>
                    <p style="color: #667eea; font-size: 13px; margin: 0; font-weight: 600;">
                      📧 ${email_user}
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; line-height: 1.6;">
                      This is an automated message. Please don't reply to this email.<br>
                      © ${new Date().getFullYear()} Trackee. All rights reserved.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    // 4. Send the actual email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Reset link sent to email." });
  } catch (error: unknown) {
    console.error("Mail Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}