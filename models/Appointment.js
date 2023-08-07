class CreatedBy {
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

    #createdBy = CreatedBy;
    #number = Number;
    #startDateTime = Date;
    #endDateTime = Date;
    #status = AppointmentStatus;

    constructor ( jsonData ) {

        
        if ( typeof jsonData == 'string' ) {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a JSON as argument.\n'+error);
            }
        }

        serialize();
    
    }

    serialize( jsonData ) {

        if ( typeof jsonData == 'string' ) {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a JSON as argument.\n'+error);
            }
        }

        console.log( JSON.stringify(jsonData) );

        const jsonKeys = Object.keys(jsonData);

        for ( const key of jsonKeys ) {

            this[key] = jsonData[key]; 

        }

        console.log( JSON.stringify(this, null, 4) );

    }

    deserialize() {

        console.log(JSON.stringify(this, null, 4));
        return JSON.stringify(this);

    }

}

module.exports.AppointmentClass = Appointment;
module.exports.AppointmentStatusClass = AppointmentStatus;
module.exports.CreatedByClass = CreatedBy;