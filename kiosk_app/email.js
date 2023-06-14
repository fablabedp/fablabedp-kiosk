import fs from 'fs';
const lang = JSON.parse(fs.readFileSync('./lang.json'));

import { SMTPClient } from 'emailjs';

const client = new SMTPClient({
	user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	host: process.env.SMTP_HOST,
	ssl: true,
});

function sendEmail(email_address) {

	console.log(lang.email.body_text);
	console.log(lang.email.subject);

	client.send(
		{
			text: lang.email.body_text,
			from: process.env.EMAIL_SENDER,
			to: email_address,
			subject: lang.email.subject,
			attachment: [
				{ path: process.env.DOWNLOADS_PATH + 'image.jpg', type: 'image/jpeg', name: 'foto.jpg' },
			],
		},
		(err, message) => {
			console.log(err || message);
		}
	);
}

export { sendEmail }