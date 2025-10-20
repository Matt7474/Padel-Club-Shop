import nodemailer from "nodemailer";

export const sendMail = async ({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	const transporter = nodemailer.createTransport({
		host: "pcs.matt-dev.fr", // ton domaine O2Switch
		port: 465,
		secure: true, // SSL
		auth: {
			user: "no-reply@pcs.matt-dev.fr",
			pass: process.env.EMAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false,
		},
		debug: true,
	});

	await transporter.sendMail({
		from: `"Padel Club Shop" <no-reply@pcs.matt-dev.fr>`,
		to,
		subject,
		html,
	});
};
