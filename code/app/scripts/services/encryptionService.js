advancePubapp.service('encryptionService',function() {
    
    var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
    var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
    
    /* Method to encrypt data */
    this.encrypt= function(data){
        var encrypted = CryptoJS.AES.encrypt(data, key, {iv:iv});
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };
    
    /* Method to decrypt data */
    this.decrypt = function(encrypted){
       var decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv: iv});
        return decrypted.toString(CryptoJS.enc.Utf8);
     };
});