import path from 'path';
import fs from 'fs';
import express from 'express';
import {fileURLToPath} from 'url';
import { SMTPClient } from 'emailjs';
import socketIO from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
const io_server = app.listen(3000, () => console.log('kiosk available at localhost:3000'));
const io_socket = socketIO(io_server);

const client = new SMTPClient({
	user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	host: process.env.SMTP_HOST,
	ssl: true,	
});

let photo_file = process.env.DOWNLOADS_PATH + 'image.jpg';


function sendEmail(email_address) {

	client.send(
		{
			text: 'Foto do encontro AFC de 20 de Maio 2023.\n\nAo obrigo do RGPD não são registados dados pessoais, tais como endereços de e-mail ou imagens.',
			from: 'Quiosque Família <quosquefamilia@gmail.com>',
			to: email_address,
			subject: 'Foto Família',
			attachment: [
				{ path: process.env.DOWNLOADS_PATH + 'image.jpg', type: 'image/jpeg', name: 'foto.jpg' },
			],
		},
		(err, message) => {
			console.log(err || message);
		}
	);
}

io_socket.on('connection', (socket) => {

	console.log('io socket connected');

	socket.on('take_photo', () => {
		// remove temporary photo when taking a new one
		removePhoto();
	});

	socket.on('send_email', (email_address) => {
		console.log('sending email to', email_address);
		sendEmail(email_address);
	});

});


function removePhoto() {
	fs.stat(photo_file, function (err, stats) {
		if (err) { return console.error(err); }
		fs.unlink(photo_file,function(err){
			if(err) return console.log(err);
		});
	});
}