import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.app_user,
    pass: config.app_password,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [config.app_url!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${config.app_url}/verify-email?token=${token}`;
      const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px 0">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

            <!-- Header -->
            <tr>
              <td style="background:#111827;color:#ffffff;padding:20px;text-align:center;font-size:22px;font-weight:bold;">
                Prisma Blog
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#333333">
                <h2 style="margin-top:0">Verify your email address</h2>

                <p style="font-size:15px;line-height:1.6">
                  Hi <strong>${user.name ?? "there"}</strong>,
                </p>

                <p style="font-size:15px;line-height:1.6">
                  Thanks for signing up for <strong>Prisma Blog</strong>.
                  Please confirm your email address by clicking the button below.
                </p>

                <div style="text-align:center;margin:30px 0">
                  <a
                    href="${verificationUrl}"
                    style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;display:inline-block;"
                  >
                    Verify Email
                  </a>
                </div>

                <p style="font-size:14px;color:#555;line-height:1.6">
                  This verification link will expire in <strong>15 minutes</strong>.
                </p>

                <p style="font-size:14px;color:#555">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="font-size:13px;background:#f3f4f6;padding:10px;border-radius:4px;word-break:break-all;">
                  ${verificationUrl}
                </p>

                <p style="font-size:14px;color:#777">
                  If you did not create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#888">
                © 2025 Prisma Blog. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
      try {
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Verify your email address",
          text: `Verify your email using this link: ${verificationUrl}`,
          html,
        });

        console.log("Verification email sent:", info.messageId);
      } catch (err) {
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      prompt : "select_account consent",
      accessType : "offline",
      clientId: config.google_client_id!,
      clientSecret: config.google_client_secret!,
    },
  },
});
