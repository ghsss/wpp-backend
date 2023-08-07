// const { Client } = require('whatsapp-web.js');

// const client = new Client();

// client.on('qr', (qr) => {
//     // Generate and scan this code with your phone
//     console.log('QR RECEIVED', qr);
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });

// client.initialize();

const express = require('express');
const { AppointmentStatusRouter } = require('./routes/appointmentStatus');
const app = express();

app.use(AppointmentStatusRouter);

app.listen(3000)