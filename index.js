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
const { WhatsappService, TextMessage } = require('./services/WhatsappService');
const { AppointmentService } = require('./services/AppointmentService');
const app = express();

app.use(AppointmentStatusRouter);

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

app.listen(3000, async () => {
    const list = await AppointmentService.getCustomerAppointments('555499026453@c.us')
    .catch( err => console.error(err));
    const list2 = await AppointmentService.getBarberShopAppointments(1)
    .catch( err => console.error(err));
    
    // await WhatsappService.start();
    // const messagesList = [];
    // const chats = await WhatsappService.getChats();
    // for ( const chat of chats )  {
    //     if ( chat.id.user.includes('99026453') ) {
    //         const t = new TextMessage(chat.id._serialized, 'Oi i i');
    //         messagesList.push(t);
    //         console.log('T: '+JSON.stringify(t, null, 4));
    //     }
    // }
    // await WhatsappService.sendTextMessages(messagesList)
    // .catch( err => {
    //     console.error(err);
    // });
});