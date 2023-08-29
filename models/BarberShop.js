
class BarberShop {
    // id bigint auto_increment primary key,
    // name varchar(150) not null, 
    // city varchar(5) not null,
    // neighborhood varchar(100) not null,
    // street varchar(100) not null,
    // number varchar(100) not null,
    // complement varchar(125),
    // phone varchar(100) unique not null,
    // wppId varchar(500) unique not null,
    // #@-28.2905353,-52.7868431
    // geolocationLatitude Decimal(8,6),
    // geolocationLongitude Decimal(9,6),
    // createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
    // modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

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

        // id bigint auto_increment primary key,
        // name varchar(150) not null, 
        // city varchar(5) not null,
        // neighborhood varchar(100) not null,
        // street varchar(100) not null,
        // number varchar(100) not null,
        // complement varchar(125),
        // phone varchar(100) unique not null,
        // wppId varchar(500) unique not null,
        // #@-28.2905353,-52.7868431
        // geolocationLatitude Decimal(8,6),
        // geolocationLongitude Decimal(9,6),
        // createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
        // modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        const databaseRecordPropsDict = {
            'barberShopId': 'id', 'barberShopName': 'name', 'barberShopPhone': 'phone', 
            'barberShopCity': 'city', 'barberShopNeighborhood': 'neighborhood', 'barberShopStreet': 'street', 
            'barberShopNumber': 'number', 'barberShopComplement': 'complement', 'barberShopWppId': 'wppId', 
            // 'availableDays': 'availableDays', 'availableHours': 'availableHours',
            'geolocationLatitude': 'geolocationLatitude', 'geolocationLongitude': 'geolocationLongitude'
        }
        const databaseRecord = {};
        for (const prop in this) {
            if (this.hasOwnProperty(prop) && Object.keys(databaseRecordPropsDict).includes(prop)) {
                // do stuff
                databaseRecord[databaseRecordPropsDict[prop]] = this[prop];
                if ( prop == 'availableDays' || prop == 'availableHours' ) {
                    if ( typeof this[prop] == 'object' ) {
                        databaseRecord[databaseRecordPropsDict[prop]] = JSON.parse(this[prop]);
                    }
                }
            } else {
                if (this.hasOwnProperty(prop) && Object.values(databaseRecordPropsDict).includes(prop)) {
                    databaseRecord[prop] = this[prop];
                    if ( prop == 'availableDays' || prop == 'availableHours' ) {
                        if ( typeof this[prop] == 'object' ) {
                            databaseRecord[prop] = JSON.parse(this[prop]);
                        }
                    }
                }
            }
        }
        return databaseRecord;
    }

    deserialize() {
        return JSON.stringify(this);
    }

}

module.exports.BarberShopClass = BarberShop;