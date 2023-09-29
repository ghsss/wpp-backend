const qrcode = require('qrcode-terminal');
const { Client, MessageTypes, MessageMedia, Message, LocalAuth, LegacySessionAuth } = require('whatsapp-web.js');
const { AppointmentService } = require('./AppointmentService');
const { NoAuth } = require('whatsapp-web.js');
// const { AppointmentService } = require('./AppointmentService');


class TextMessage {

    chatId = new String();
    text = new String();

    constructor(chatId = String, text = String) {
        const constructorTypes = [
            'string',
            'string'
        ]
        if (typeof chatId != constructorTypes[0]) {
            throw 'Expected a ' + constructorTypes[0].toString() + ' type as 1 parameter';
        } else if (typeof text != constructorTypes[1]) {
            throw 'Expected a ' + constructorTypes[1].toString() + ' type as 2 parameter';
        } else {
            this.chatId = chatId;
            this.text = text;
        }
        console.log('Message instance: ' + JSON.stringify(this));
    }

}

module.exports.TextMessage = TextMessage;

class MediaMessage {

    content = new MessageMedia();

    constructor(chatId = new String(), content = new MessageMedia()) {
        const constructorTypes = [
            String,
            MessageMedia
        ]
        if (typeof chatId !== constructorTypes[0]) {
            throw 'Expected a string type as 1 parameter';
        } else if (typeof content !== constructorTypes[1]) {
            throw 'Expected a MessageMedia type as 2 parameter';
        } else {
            this.chatId = chatId;
            this.content = content;
        }
        console.log('Message instance: ' + JSON.stringify(this));
    }

}

module.exports.MediaMessage = MediaMessage

class WhatsappService {

    #client = new Client({
        authStrategy: new LocalAuth({ clientId: "barbershop", headless: false })
        // authStrategy: new NoAuth()
    });
    // #client = new Client({
    //     authStrategy: new LegacySessionAuth({
    //         session: {} // saved session object
    //     })
    // });

    messages = new Array < TextMessage > ([])

    async #initializeClient() {
        console.log('Initializing client...');
        return new Promise( async (resolve, reject) => {
            try {
                this.#client.on('qr', (qr) => {
                    // Generate and scan this code with your phone
                    console.log('QR RECEIVED', qr);
                    qrcode.generate(qr, { small: true });
                });
                this.#client.on('change_state', (state) => {
                    console.log('Client state changed: '+state);
                });
                this.#client.on('auth_failure', (message) => {
                    console.log('Client auth_failure: '+message);
                    // resolve();
                });
                this.#client.on('loading_screen', (percentage, message) => {
                    console.log('Client is loading '+percentage+'%... '+message.toString());
                    // if ( percentage == 100 ) resolve();
                    // resolve();
                });
                this.#client.on('disconnected', (reason) => {
                    const msg = 'Client disconnected message: '+reason;
                    console.log(msg);
                    throw msg;
                    // reject();
                });
                this.#client.on('message', (message) => {
                    console.log('Client received message: '+message.body);
                });
                this.#client.on('ready', () => {
                    console.log('Client is ready!');
                    resolve();
                });
                await this.#client.initialize();
            } catch (error) {
                reject('Error initializing client: ' + error);
            }
        })
    }

    async sendTextMessages(messages) {
        const response = {
            success: false,
            response: []
        }
        console.log(messages);
        for await (let message of messages) {
            await this.#client.sendMessage(message.chatId, String(message.text))
            .then( m => {
                response.success=true;
                response.response.push(m);
                console.log(JSON.stringify(m));
            })
            .catch( err => {
                response.success=false;
                console.log(err);
                if ( !Object.keys(response).includes('error') ) {
                    response.error = [err.toString()];
                } else {
                    response.error.push(err.toString());
                }
                this.getClientState();
            });
        }
        return response;
    }

    async start() {
        const client = this.#client;
        await this.#initializeClient();
        console.log('Client instanciated!');
        try {
            client.on('message', msg => {
                // this.processIncomingMessages(msg);
            });
        } catch (error) {
            console.error('Error: ' + error);
        }
    }

    async getChats() {
        const chats = await this.#client.getChats();
        return chats;
    }

    async getChatById(wppId) {
        const chats = await this.#client.getChats();
        return chats;
    }

    async getContactById(wppId) {
        const chats = await this.#client.getContactById(wppId);
        return chats;
    }

    async processIncomingMessages(msg = Message) {

        const commands = {
            'defaultMessage': () => {
                return `OLÁ, ${msg.author}! BEM VINDO À BARBEARIA DO GABRIEL! \n +
                    PARA LISTAR SEUS HORÁRIOS AGENDADOS DIGITE: /horarios`
            },
            '/horarios': () => {
                // const customerAppointments = [];//getCustomerAppointments(msg.from);
                const customerAppointments = AppointmentService.getCustomerAppointments(msg.from);
                if (customerAppointments.length == 0) {
                    const message = 'Você não possui nenhum agendamento. \nRealize o agendamento através do Aplicativo: Bar Bear.';
                    this.#client.sendMessage(msg.from, message);
                } else {
                    for (const customerAppointment of customerAppointments) {
                        console.log('Customer appointment: ' + JSON.stringify(customerAppointment, null, 4));
                    }
                }
            },
            '/cancelar': (appointmentId) => {
                AppointmentService.cancelAppointment(appointmentId);
            }
        }
        if (Object.keys(commands).indexOf(msg.body) > 0) {
            commands[msg.body]();
        } else {
            commands['defaultMessage']();
        }
    }

    async waitConnect() {

        const pairingStates = [
            'OPENING',
            'PAIRING',
            'UNLAUNCHED',
            'UNPAIRED',
            'UNPAIRED_IDLE'
        ];

        const wait10Seconds = async () => {
            setTimeout(() => {
                console.log('10 seconds waiting finished.');
            }, 10000);
        };

        await wait10Seconds();

        let clientState = await this.getClientState();

        while (typeof clientState == 'undefined' || pairingStates.includes(clientState)) {

            setTimeout(async () => {

                clientState = await this.getClientState();

            }, 15000);

        }

    }

    async getClientState() {
        const client = this.#client;
        try {
            const connectedStates = [
                'CONNECTED',
                'OPENING',
                'PAIRING'
            ];
            const unpairedStates = [
                'UNLAUNCHED',
                'UNPAIRED',
                'UNPAIRED_IDLE'
            ];
            const errorStates = [
                'TOS_BLOCK',
                'TIMEOUT',
                'SMB_TOS_BLOCK',
                'PROXYBLOCK',
                'DEPRECATED_VERSION',
                'CONFLICT'
            ];
            const clientState = await client.getState();
            console.log('CLIENT STATE: ' + clientState);
            if (errorStates.indexOf(clientState) > -1) {
                console.error('Client error. Restart the client and try again.');
                client = new Client({
                    authStrategy: new LocalAuth({ clientId: "barbershop", headless: false })
                    // authStrategy: new NoAuth()
                });
                this.start();
            } else if (unpairedStates.indexOf(clientState) > -1 ) {
                console.error('Client is unpaired. Please scan the QR Code and try again');
            } else {
                console.log('Client connected. Wait some time and try again or restart the client.');
            }
            return clientState;
        } catch (error) {
            try {
                console.error('Error returning client state: ' + error);
                console.error('Reseting client state...');
                await this.#client.resetState();
                console.error('Client state reseted!');
            } catch (error2) {
                console.error('Error reseting client state: ' + error2);
            }
        }
    }

}

module.exports.WhatsappService = new WhatsappService();