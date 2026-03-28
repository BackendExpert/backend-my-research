import nodemailer, { Transporter } from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.configService.get<string>("EMAIL_USER"),
        pass: this.configService.get<string>("EMAIL_PASSWORD")
      },
    });
  }

  async sendOTP(email: string, otp: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const projectName = this.configService.get<string>("PROJECT_NAME");

    await this.transporter.sendMail({
      from: `"${projectName}" <${this.configService.get<string>("EMAIL_USER")}>`,
      to: email,
      subject: `${projectName} - Your OTP Code`,
      text: `Your OTP is ${otp}. It expires in 5 minutes. Requested from IP: ${ipAddress}, Device: ${userAgent}`,
      html: `
        <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:620px;margin:40px auto;padding:0 20px;">

            <div style="background:#ffffff;border:1px solid #dcdfe3;border-radius:6px;overflow:hidden;">

              <!-- HEADER -->
              <div style="padding:25px 30px;border-bottom:1px solid #e5e7eb;background:#fafafa;">
                <h1 style="margin:0;font-size:20px;color:#1f2937;font-weight:600;">
                  ${projectName}
                </h1>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">
                  Account Verification System
                </p>
              </div>

              <!-- BODY -->
              <div style="padding:35px 30px;">

                <h2 style="margin:0 0 15px;font-size:18px;color:#111827;font-weight:600;">
                  Identity Verification Required
                </h2>

                <p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:20px;">
                  A request has been made to access your account within the system. 
                  To proceed securely, please use the One-Time Password (OTP) provided below.
                </p>

                <!-- OTP BOX -->
                <div style="margin:25px 0;text-align:center;">
                  <div style="
                    display:inline-block;
                    padding:14px 28px;
                    font-size:26px;
                    font-weight:700;
                    letter-spacing:6px;
                    color:#1d4ed8;
                    background:#f1f5f9;
                    border:1px solid #cbd5e1;
                    border-radius:4px;
                  ">
                    ${otp}
                  </div>
                </div>

                <p style="font-size:13px;color:#b91c1c;font-weight:600;margin-top:5px;">
                  This code will expire in 5 minutes.
                </p>

                <!-- DIVIDER -->
                <div style="margin:25px 0;border-top:1px solid #e5e7eb;"></div>

                <!-- DESCRIPTION -->
                <p style="font-size:13px;color:#374151;line-height:1.7;">
                  If you did not initiate this request, no further action is required. 
                  Your account remains secure.
                </p>

                <!-- INFO -->
                <div style="margin-top:20px;padding:15px;background:#fafafa;border:1px solid #e5e7eb;border-radius:4px;">
                  <p style="font-size:12px;color:#6b7280;margin:4px 0;">
                    IP Address: ${ipAddress || "N/A"}
                  </p>
                  <p style="font-size:12px;color:#6b7280;margin:4px 0;">
                    Device / Browser: ${userAgent || "N/A"}
                  </p>
                </div>

              </div>

              <!-- FOOTER -->
              <div style="padding:20px 30px;border-top:1px solid #e5e7eb;background:#fafafa;font-size:12px;color:#6b7280;">
                
                <p style="margin:5px 0;">
                  For assistance, please contact the system administrator.
                </p>

                <p style="margin:5px 0;">
                  © ${new Date().getFullYear()} ${projectName}. All rights reserved.
                </p>

                <!-- CREDIT -->
                <p style="margin-top:10px;font-size:12px;color:#6b7280;">
                  Developed & Maintained by 
                  <a href="https://www.blackalphalabs.com/" target="_blank" style="color:#1d4ed8;text-decoration:none;">
                    BlackalphaLabs PVT
                  </a>
                </p>

              </div>

            </div>

          </div>
        </div>
      `,
    });
  }


  async NotificationEmail(email: string, notification: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const projectName = this.configService.get<string>("PROJECT_NAME");

    await this.transporter.sendMail({
      from: `"${projectName}" <${this.configService.get<string>("EMAIL_USER")}>`,
      to: email,
      subject: `${projectName} - Notification`,
      text: `${projectName} - ${notification}. IP: ${ipAddress}, Device: ${userAgent}`,
      html: `
        <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:620px;margin:40px auto;padding:0 20px;">

            <div style="background:#ffffff;border:1px solid #dcdfe3;border-radius:6px;overflow:hidden;">

              <!-- HEADER -->
              <div style="padding:25px 30px;border-bottom:1px solid #e5e7eb;background:#fafafa;">
                <h1 style="margin:0;font-size:20px;color:#1f2937;font-weight:600;">
                  ${projectName}
                </h1>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">
                  System Notification Service
                </p>
              </div>

              <!-- BODY -->
              <div style="padding:35px 30px;">

                <h2 style="margin:0 0 15px;font-size:18px;color:#111827;font-weight:600;">
                  Notification Update
                </h2>

                <p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:20px;">
                  This message is to inform you of an update related to your account or system activity. 
                  Please review the details provided below.
                </p>

                <!-- MESSAGE BOX -->
                <div style="
                  margin:25px 0;
                  padding:18px 20px;
                  background:#f1f5f9;
                  border:1px solid #cbd5e1;
                  border-left:4px solid #1d4ed8;
                  border-radius:4px;
                  font-size:15px;
                  font-weight:600;
                  color:#1e293b;
                ">
                  ${notification}
                </div>

                <!-- DIVIDER -->
                <div style="margin:25px 0;border-top:1px solid #e5e7eb;"></div>

                <!-- DESCRIPTION -->
                <p style="font-size:13px;color:#374151;line-height:1.7;">
                  This notification has been automatically generated by the system. 
                  If you believe this message was sent in error, please contact the system administrator.
                </p>

                <!-- INFO -->
                <div style="margin-top:20px;padding:15px;background:#fafafa;border:1px solid #e5e7eb;border-radius:4px;">
                  <p style="font-size:12px;color:#6b7280;margin:4px 0;">
                    IP Address: ${ipAddress || "N/A"}
                  </p>
                  <p style="font-size:12px;color:#6b7280;margin:4px 0;">
                    Device / Browser: ${userAgent || "N/A"}
                  </p>
                </div>

              </div>

              <!-- FOOTER -->
              <div style="padding:20px 30px;border-top:1px solid #e5e7eb;background:#fafafa;font-size:12px;color:#6b7280;">
                
                <p style="margin:5px 0;">
                  This is an automated system notification. Please do not reply to this message.
                </p>

                <p style="margin:5px 0;">
                  © ${new Date().getFullYear()} ${projectName}. All rights reserved.
                </p>

                <!-- CREDIT -->
                <p style="margin-top:10px;">
                  Developed & Maintained by 
                  <a href="https://www.blackalphalabs.com/" target="_blank" style="color:#1d4ed8;text-decoration:none;">
                    BlackalphaLabs PVT
                  </a>
                </p>

              </div>

            </div>

          </div>
        </div>
      `,
    });
  }


}

