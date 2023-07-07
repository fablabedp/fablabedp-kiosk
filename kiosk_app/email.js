import fs from 'fs';
import path from 'path';
import { SMTPClient } from 'emailjs';
import { fileURLToPath } from 'url';
import fileUrl from 'file-url';
import dotenv from 'dotenv';

// get enviroment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lang = JSON.parse(fs.readFileSync('./lang.json'));

const client = new SMTPClient({
	user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	host: process.env.SMTP_HOST,
	ssl: true,
});

function sendEmail(email_address, path, filename) {

	client.send(
		{
			text: lang.email.body_text,
			from: process.env.EMAIL_SENDER,
			to: email_address,
			subject: lang.email.subject,
			attachment: [
				{ path: fileURLToPath(fileUrl(path)), type: 'image/jpeg', name: filename },
			],
		},
		(err, message) => {
			console.log(err || message);
		}
	);
}

export { sendEmail }