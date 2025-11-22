const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure Nodemailer transport (example using Gmail, adjust as needed)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NM_EMAIL,
        pass: process.env.NM_PASSWORD,
    },
});

const sendEmailCode = async (toEmail, code) => {
    const msg = {
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };

    try {
        // Try sending with SendGrid first
        await sgMail.send(msg);
        console.log('Email sent via SendGrid');
    } catch (sendGridError) {
        console.warn('SendGrid failed, falling back to Nodemailer:', sendGridError.message);

        // Fallback to Nodemailer
        try {
            await transporter.sendMail({
                from: process.env.NM_EMAIL,
                to: toEmail,
                subject: msg.subject,
                text: msg.text,
                html: msg.html,
            });
            console.log('Email sent via Nodemailer');
        } catch (nodemailerError) {
            console.error('Nodemailer also failed:', nodemailerError.message);
            throw nodemailerError; // rethrow if you want upstream handling
        }
    }
};

module.exports = sendEmailCode;
