import { SMTPClient } from 'emailjs';

const client = new SMTPClient({
	user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	host: process.env.SMTP_HOST,
	ssl: true,
});

function sendEmail(email_address) {

	client.send(
		{
			text: 'body text',
			from: 'Sender <sender@email.com>',
			to: email_address,
			subject: 'subject',
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