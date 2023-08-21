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
const { BarberShopRouter } = require('./routes/barberShop');
const { CustomerRouter } = require('./routes/customer');
const app = express();

app.use(AuthRouter);
app.use(AppointmentStatusRouter);
app.use(AppointmentRouter);
app.use(BarberShopRouter);
app.use(CustomerRouter);

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

async function main() {
    await WhatsappService.start()
        .catch(err => {
            console.error(err);
        })
    app.listen(3000, async () => {
        console.log('Server listening in localhost:3000');
        // const auth = await AuthService.login('555499026453@c.us', 'BARBERSHOP');
        // console.log(JSON.stringify(auth, null, 4));
        // const tok = AuthService.generateToken('555499026453@c.us');
        // console.log(tok);
        // AuthService.verifyToken('555499026453@c.us', tok, hex => {
        //     console.log(hex);
        // });
    });
}

main();