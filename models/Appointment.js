class CreatedBy {
    #id;
    #name;
    #phone;
}

class Customer {
    #id;
    #name;
    #phone;
}

class Barber {
    #id;
    #name;
    #phone;
}

class Barbershop {
    #id;
    #name;
    #phone;
}

class AppointmentStatus {
    #id;
    #description;

    constructor (json) {
        for ( const k of  Object.keys(json) ) {
            this[k] = json[k];
        }
    }
}

class Appointment {

    #id = Number;
    #createdAt = Date;
    #modifiedAt = Date;
    #createdBy = CreatedBy;
    #modifiedBy = CreatedBy;
    #customer = Customer;
    #dayAndTime = Date;
    #barberShop = Barbershop;
    #barberShopWorker = Barber;
    #appointmentStatus = AppointmentStatus;

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
        // #customer = Customer;
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
        //     "customerId": "555499026453@c.us",
        //     "customerName": "Gabriel",
        //     "customerPhone": "555499026453",
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
            'id': 'id',
            // 'createdAt': 'createdAt',
            // 'modifiedAt': 'modifiedAt',
            "createdBy": "555499026453@c.us",
            'customerId': 'customer',
            'createdBy': 'createdBy',
            'modifiedBy': 'modifiedBy',
            'customerId': 'customer',
            'dayAndTime': 'dayAndTime',
            'barberShopId': 'barberShop',
            'workerId': 'barberShopWorker',
            'appointmentStatus': 'appointmentStatus',
            'service': 'service'
        }
        const databaseRecord = {};
        for ( const prop in this ) {
            if (this.hasOwnProperty(prop) && Object.keys(databaseRecordPropsDict).includes(prop) ) {
                // do stuff
                if ( prop == 'dayAndTime' ) {
                    this[prop] = this[prop].split('.')[[0]];
                }
                databaseRecord[databaseRecordPropsDict[prop]] = this[prop];
            } else {
                if (this.hasOwnProperty(prop) && Object.values(databaseRecordPropsDict).includes(prop)) {
                    if ( prop == 'dayAndTime' ) {
                        this[prop] = this[prop].split('.')[[0]];
                    }
                    databaseRecord[prop] = this[prop];
                }
            }
        }
        return databaseRecord;
    }

    deserialize() {
        return JSON.stringify(this);
    }

}

module.exports.AppointmentClass = Appointment;
module.exports.AppointmentStatusClass = AppointmentStatus;
module.exports.CreatedByClass = CreatedBy;