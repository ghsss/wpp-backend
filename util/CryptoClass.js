const crypto = require('crypto');

class Crypto {
    hash(str) {
        return crypto.createHash('sha512').update(str).digest('hex');
    }
}

module.exports.CryptoUtil = new Crypto();