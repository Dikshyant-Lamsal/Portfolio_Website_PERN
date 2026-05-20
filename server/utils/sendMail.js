// server/utils/sendMail.js
// Sends an email notification via Gmail SMTP using Nodemailer.
// Called by POST /api/contact after a successful DB insert.
//
// Required environment variables:
//   EMAIL_USER=dikshyant2005@gmail.com
//   EMAIL_PASS=your_gmail_app_password   ← NOT your Gmail login password.
//             Generate at: https://myaccount.google.com/apppasswords
//             (Requires 2FA enabled on the Gmail account)
//
// If email sending fails, the error is logged but NOT thrown —
// so the contact form still returns success to the user.

const nodemailer = require('nodemailer')

// ── Create reusable transporter ───────────────────────────────────────────
// Transporter is created once per process, not per request.
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
}

// ── sendContactNotification ───────────────────────────────────────────────
// Sends a formatted notification email to the portfolio owner.
//
// @param {object} contact  — { name, email, message, created_at }
// @returns {Promise<void>} — resolves whether or not sending succeeded
//
async function sendContactNotification(contact) {
    // Skip silently if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  sendMail: EMAIL_USER or EMAIL_PASS not set — skipping notification.')
        return
    }

    const transporter = createTransporter()

    const timestamp = contact.created_at
        ? new Date(contact.created_at).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,   // notify yourself
        subject: `New Portfolio Contact Message — ${contact.name}`,
        // Plain-text fallback
        text: [
            `New message from your portfolio contact form.`,
            ``,
            `Name:      ${contact.name}`,
            `Email:     ${contact.email}`,
            `Received:  ${timestamp}`,
            ``,
            `Message:`,
            contact.message,
        ].join('\n'),
        // HTML version
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; color: #1a1b1e;">
                <h2 style="margin-bottom: 4px; color: #2d6be4;">New Contact Message</h2>
                <p style="color: #8e919e; font-size: 13px; margin-top: 0;">
                    Received via your portfolio contact form
                </p>

                <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px 12px; background:#f0f0ed; font-size:13px;
                                   font-weight:600; width:100px; border-radius:4px 0 0 4px;">
                            Name
                        </td>
                        <td style="padding: 8px 12px; font-size:14px;">${contact.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; background:#f0f0ed; font-size:13px;
                                   font-weight:600; border-radius:4px 0 0 4px;">
                            Email
                        </td>
                        <td style="padding: 8px 12px; font-size:14px;">
                            <a href="mailto:${contact.email}"
                               style="color:#2d6be4;">${contact.email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; background:#f0f0ed; font-size:13px;
                                   font-weight:600; border-radius:4px 0 0 4px;">
                            Received
                        </td>
                        <td style="padding: 8px 12px; font-size:14px;">${timestamp}</td>
                    </tr>
                </table>

                <div style="background:#f8f8f6; border-left:3px solid #2d6be4;
                            padding:16px 20px; border-radius:0 6px 6px 0; margin:20px 0;">
                    <p style="margin:0 0 6px; font-size:12px; font-weight:600;
                               color:#8e919e; text-transform:uppercase; letter-spacing:0.08em;">
                        Message
                    </p>
                    <p style="margin:0; font-size:14px; line-height:1.7; white-space:pre-wrap;">
                        ${contact.message}
                    </p>
                </div>

                <a href="mailto:${contact.email}?subject=Reply%20from%20Dikshyant%20Lamsal"
                   style="display:inline-block; background:#2d6be4; color:#fff;
                          padding:10px 20px; border-radius:6px; text-decoration:none;
                          font-size:13px; font-weight:600; margin-top:8px;">
                    Reply to ${contact.name}
                </a>
            </div>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`✅ Contact notification sent for: ${contact.email}`)
    } catch (err) {
        console.error('❌ sendMail error:', err.message)
        console.error('❌ sendMail full error:', JSON.stringify({
            code: err.code,
            command: err.command,
            response: err.response,
        }))
    }
}

module.exports = { sendContactNotification }