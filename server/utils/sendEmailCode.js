const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailCode = async (toEmail, code) => {
    const msg = {
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };
    await sgMail.send(msg);
}

module.exports = sendEmailCode;