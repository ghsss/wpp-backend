class ErrorMessage {
    message = new String();
    constructor( message ) {
        if ( typeof message != 'string' ) {
            message = message.toString();
        }
        this.message = message;
    }
}

class GETResponse {
    success = new String();
    response = new String();
    #error = Array(ErrorMessage); 
}