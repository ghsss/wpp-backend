const { WhatsappService } = require("./services/WhatsappService");


const go = async () => {
    
    await WhatsappService.start()
            .then( async () => {
                const contact = await WhatsappService.getContactById('55549902645312@c.us');
                console.log('Contact: '+JSON.stringify(contact, null, 4));
                // app.listen(3000, async () => {
                //     console.log('Server listening in localhost:3000');
                // });
            })
            .catch(err => {
                console.error(err);
            })

}

go();