
class BarberShopWorker {
    #id;
    #name;
    #phone;

    constructor ( jsonData ) {
        if ( typeof jsonData == 'string' ) {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n'+error);
            }
        }
        this.serialize(jsonData);
    }

    serialize( jsonData ) {
        if ( typeof jsonData == 'string' ) {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n'+error);
            }
        }
        const jsonKeys = Object.keys(jsonData);
        for ( const key of jsonKeys ) {
            this[key] = jsonData[key]; 
        }
        console.log( 'Serialized appointment: ' + JSON.stringify(this, null, 4) );
    }

    toDatabaseRecord() {

        // #id = Number;
        // #createdAt = Date;
        // #modifiedAt = Date;
        // #createdBy = CreatedBy;
        // #modifiedBy = CreatedBy;
        // #BarberShopWorker = BarberShopWorker;
        // #dayAndTime = Date;
        // #barberShop = Barbershop;
        // #barberShopWorker = Barber;
        // #appointmentStatus = AppointmentStatus;
        // {
        //     "id": 1,
        //     "dayAndTime": "2023-08-13T13:29:21.000Z",
        //     "createdBy": "555499026453@c.us",
        //     "modifiedBy": "555499026453@c.us",
        //     "createdAt": "2023-08-13T13:29:21.000Z",
        //     "modifiedAt": "2023-08-13T13:29:21.000Z",
        //     "appointmentStatus": "Agendado",
        //     "BarberShopWorkerId": "555499026453@c.us",
        //     "BarberShopWorkerName": "Gabriel",
        //     "BarberShopWorkerPhone": "555499026453",
        //     "barberShopId": 1,
        //     "barberShopName": "Barbearia do Gabriel",
        //     "barberShopPhone": "555499026453",
        //     "barberShopCity": "CZO",
        //     "barberShopCityName": "Carazinho",
        //     "barberShopNeighborhood": "Centro",
        //     "barberShopStreet": "Alexandre da Motta",
        //     "barberShopNumber": "1264",
        //     "barberShopComplement": null,
        //     "geolocationLatitude": "-28.290535",
        //     "geolocationLongitude": "-52.786843",
        //     "barberShopWppId": "555499026453@c.us",
        //     "workerId": "555499026453@c.us",
        //     "workerName": "Gabriel",
        //     "workerPhone": "555499026453"
        // }
        const databaseRecordPropsDict = {
            'barberShopWorkerId': 'id',
            // 'createdAt': 'createdAt',
            // 'modifiedAt': 'modifiedAt',
            'barberShopId': 'barberShop',
            'workerId': 'worker',
        }
        const databaseRecord = {};
        for ( const prop in this ) {
            if (this.hasOwnProperty(prop) && Object.keys(databaseRecordPropsDict).includes(prop) ) {
                // do stuff
                databaseRecord[databaseRecordPropsDict[prop]] = this[prop];
            } else {
                if (this.hasOwnProperty(prop) && Object.values(databaseRecordPropsDict).includes(prop)) {
                    databaseRecord[databaseRecordPropsDict[prop]] = this[prop];
                }
            }
        }
        return databaseRecord;
    }

    deserialize() {
        return JSON.stringify(this);
    }

}

module.exports.BarberShopWorkerClass = BarberShopWorker;