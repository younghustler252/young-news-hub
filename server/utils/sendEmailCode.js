const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.NM_HOST,
    port: Number(process.env.NM_PORT),
    secure: process.env.NM_SECURE === "true",
    auth: {
        user: process.env.NM_EMAIL,
        pass: process.env.NM_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Verify connection at startup
transporter.verify((err) => {
    if (err) {
        console.error("SMTP VERIFY FAILED ❌", err);
    } else {
        console.log("SMTP READY ✅");
    }
});

const sendEmailCode = async (toEmail, code) => {
    try {
        const info = await transporter.sendMail({
            from: `"EveryVoice" <${process.env.NM_EMAIL}>`,
            to: toEmail,
            subject: "Your Verification Code",
            text: `Your verification code is: ${code}`,
            html: `<p>Your verification code is <b>${code}</b></p>`,
        });

        console.log("EMAIL SENT ✅", info.messageId);
        return info;
    } catch (err) {
        console.error("EMAIL SEND FAILED ❌", err);
        throw err;
    }
};

module.exports = sendEmailCode;
