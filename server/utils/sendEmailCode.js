// sendEmailCode.js
const nodemailer = require("nodemailer");

// Create Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
    service: process.env.NM_SERVICE,               // e.g., 'gmail'
    auth: {
        user: process.env.NM_EMAIL,               // your email
        pass: process.env.NM_PASSWORD,           // Gmail App Password
    },
    port: Number(process.env.NM_PORT) || 587,     // TLS port
    secure: process.env.NM_SECURE === "true",     // false for TLS 587, true for SSL 465
    tls: {
        rejectUnauthorized: false,               // avoids TLS handshake errors on cloud hosts
    },
});

// Verify SMTP connection on startup and log results
transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP connection verification failed:", err);
    } else {
        console.log("SMTP connection verified successfully!");
    }
});

/**
 * Sends a verification code email
 * @param {string} toEmail - Recipient email address
 * @param {string} code - Verification code
 */
const sendEmailCode = async (toEmail, code) => {
    const mailOptions = {
        from: process.env.NM_EMAIL,
        to: toEmail,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);

        return info;
    } catch (error) {
        console.error("Failed to send email:", error);

        // Detailed error logging for troubleshooting
        if (error.code === "ETIMEDOUT") {
            console.error("Connection timed out: the SMTP server may be blocked by Render.");
        } else if (error.code === "EAUTH") {
            console.error("Authentication failed: check NM_EMAIL and NM_PASSWORD.");
        } else if (error.code === "ECONNECTION") {
            console.error("Cannot connect to SMTP server: check NM_SERVICE, NM_PORT, and network/firewall.");
        }

        throw error; // rethrow for upstream handling
    }
};

module.exports = sendEmailCode;
