const nodemailer = require("nodemailer");

const isDev = process.env.NODE_ENV !== "production";

let transporter;

if (isDev) {
	transporter = nodemailer.createTransport({
		host: process.env.NM_HOST,
		port: Number(process.env.NM_PORT) || 587,
		secure: process.env.NM_SECURE === "true",
		auth: {
			user: process.env.NM_EMAIL,
			pass: process.env.NM_PASSWORD,
		},
	});

	transporter.verify()
		.then(() => console.log("SMTP READY ✅ (Dev only)"))
		.catch(err => console.error("SMTP VERIFY FAILED ❌", err.message));
}

const sendEmailCode = async (toEmail, code) => {
	const subject = "Your Verification Code";
	const text = `Your verification code is: ${code}`;
	const html = `<p>Your verification code is: <strong>${code}</strong></p>`;

	try {
		// --------------------
		// DEV → SMTP
		// --------------------
		if (isDev) {
			return await transporter.sendMail({
				from: `"EveryVoice" <${process.env.NM_EMAIL}>`,
				to: toEmail,
				subject,
				text,
				html,
			});
		}

		// --------------------
		// PROD → Brevo API (HTTPS)
		// --------------------
		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": process.env.BREVO_API_KEY,
			},
			body: JSON.stringify({
				sender: {
					email: "everyvoice@gmail.com", // MUST be verified in Brevo
					name: "EveryVoice",
				},
				to: [{ email: toEmail }],
				subject,
				htmlContent: html,
				textContent: text,
			}),
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new Error(`Brevo API failed: ${errText}`);
		}

		return true;
	} catch (err) {
		console.error("EMAIL SEND FAILED ❌", err.message);
		throw err;
	}
};

module.exports = sendEmailCode;
