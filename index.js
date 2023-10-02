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
const { BarberRouter } = require('./routes/barber');

const cors = require('cors');
const { CitiesRouter } = require('./routes/availableCities');
const app = express();

// enabling CORS for some specific origins only.
let corsOptions = {
    // origin : ['http://localhost:5500'],
    origin : '*',
    methods: ['GET', 'POST ','PUT', 'UPDATE', 'DELETE']
 }
app.use(cors(corsOptions));

app.use(AuthRouter);
app.use(AppointmentStatusRouter);
app.use(AppointmentRouter);
app.use(BarberShopRouter);
app.use(CustomerRouter);
app.use(BarberRouter);
app.use(CitiesRouter);

// app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

async function main() {
    await WhatsappService.start()
        .then(() => {
            app.listen(3000, async () => {
                console.log('Server listening in localhost:3000');
            });
        })
        .catch(err => {
            console.error(err);
        })
}

main();