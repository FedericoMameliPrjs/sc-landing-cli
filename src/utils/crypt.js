const crypto = require('crypto');

// const algorithm = 'aes-256-ctr';
// const password = 'sc-landing-page';

module.exports = class{
    constructor(algorithm, pass){
      this.algorithm = algorithm;
      this.pass = pass;
      // this.cipher = crypto.createCipher()
    }

    encrypt(text){

    }
};