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
const { AuthService } = require('./services/AuthService');
const { AppointmentRouter } = require('./routes/appointment');
const { AuthRouter } = require('./routes/auth');
const app = express();

app.use(AuthRouter);
app.use(AppointmentStatusRouter);
app.use(AppointmentRouter);

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

app.listen(3000, async () => {
    // const list = await AppointmentService.getCustomerAppointments('555499026453@c.us')
    // .catch( err => console.error(err));
    // const list2 = await AppointmentService.getBarberShopAppointments(1)
    // .catch( err => console.error(err));
    
    const auth = await AuthService.login('555499026453@c.us', 'BARBERSHOP');
    console.log(JSON.stringify(auth, null, 4));
    const tok = AuthService.generateToken('555499026453@c.us');
    console.log(tok);
    AuthService.verifyToken('555499026453@c.us', tok, hex => {
        console.log(hex);
    });
    // const newAppointments = auth.response[0].user.appointments;
    // await AppointmentService.newAppointments(newAppointments)
    //     .then(async insertRes => {
    //         console.log(JSON.stringify(insertRes, null, 4));
    //         newAppointments[0].appointmentStatus = 'Cancelado';
    //     })
    //     .catch(err2 => {
    //         console.log(JSON.stringify(err2, null, 4));
    //     });
    //     const updateRes = await AppointmentService.updateAppointments(newAppointments).catch(
    //         err3 => {
    //             console.log(JSON.stringify(err3, null, 4));
    //         }
    //     );
    //     console.log(JSON.stringify(updateRes, null, 4));

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