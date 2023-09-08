
class BarberShopWorkerService {
    // name varchar(250) not null,
    // description varchar(500),
    // durationInMinutes int not null,
    // availableDays varchar(500) not null, # [0,1,2,3,4,5,6]
    // availableHours varchar(1000) not null, # [{"0":["11:30 12:00","13:30 18:00"]}]
    // barberShop bigint not null,
    // barberShopWorker bigint not null,

    constructor(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        this.serialize(jsonData);
    }

    serialize(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const jsonKeys = Object.keys(jsonData);
        for (const key of jsonKeys) {
            this[key] = jsonData[key];
        }
        console.log('Serialized appointment: ' + JSON.stringify(this, null, 4));
    }

    toDatabaseRecord() {
        // {
        //     "barberShopWorkerServiceId": 1,
        //     "barberShopWorkerServiceName": "Barbearia do Gabriel",
        //     "barberShopWorkerServicePhone": "555499026453",
        //     "barberShopWorkerServiceCity": "CZO",
        //     "barberShopWorkerServiceCityName": "Carazinho",
        //     "barberShopWorkerServiceNeighborhood": "Centro",
        //     "barberShopWorkerServiceStreet": "Alexandre da Motta",
        //     "barberShopWorkerServiceNumber": "1264",
        //     "barberShopWorkerServiceComplement": null,
        //     "geolocationLatitude": "-28.290535",
        //     "geolocationLongitude": "-52.786843",
        //     "barberShopWorkerServiceWppId": "555499026453@c.us",
        //     "workerId": "555499026453@c.us",
        //     "workerName": "Gabriel",
        //     "workerPhone": "555499026453"
        // }

        // name varchar(250) not null,
        // description varchar(500),
        // durationInMinutes int not null,
        // availableDays varchar(500) not null, # [0,1,2,3,4,5,6]
        // availableHours varchar(1000) not null, # [{"0":["11:30 12:00","13:30 18:00"]}]
        // barberShop bigint not null,
        // barberShopWorker bigint not null,
        const databaseRecordPropsDict = {
            'service': 'id',
            'serviceName': 'name', 'serviceDescription': 'description', 'serviceDurationInMinutes': 'durationInMinutes',
            'availableDays': 'availableDays', 'availableHours': 'availableHours', 'barberShopId': 'barberShop',
            'workerId': 'barberShopWorker'
        }
        const databaseRecord = {};
        for ( const prop in this ) {
            if (this.hasOwnProperty(prop) && Object.keys(databaseRecordPropsDict).includes(prop) ) {
                // do stuff
                console.log(databaseRecordPropsDict[prop]);
                databaseRecord[databaseRecordPropsDict[prop]] = this[prop];
            } else {
                if (this.hasOwnProperty(prop) && Object.values(databaseRecordPropsDict).includes(prop)) {
                    // console.log(databaseRecordPropsDict[prop]);
                    databaseRecord[prop] = this[prop];
                }
            }
        }
        console.log(databaseRecord);
        return databaseRecord;
    }

    deserialize() {
        return JSON.stringify(this);
    }

}

module.exports.BarberShopWorkerServiceClass = BarberShopWorkerService;