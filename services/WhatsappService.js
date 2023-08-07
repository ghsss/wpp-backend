const { Client } = require('whatsapp-web.js');
const { AppointmentClass } = require('./AppointmentService');

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();

class WhatsappService {

    #client = Client;

    constructor ( options ) {

        const defaultOptions = {
            token: '',
            auth: ''
        }

        

        if ( client.constructor.name != 'Client' ) {
            throw 'Client with wrong class type';
        }
    }

}

module.exports.WhatsappService = client;