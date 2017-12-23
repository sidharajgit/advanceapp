advancePubapp.service('jwtEncoder', function() { 
 
    /* Method to create JWT for requesting json*/
    this.encode = function(key){
		if(angular.isObject(key)){
           key = JSON.stringify(key);
        }
		/*Json web token for ajax calls*/
		var header = {
		  "alg": "HS256",
		  "typ": "JWT"
		};
		
		var encodedHeader = getBase64(JSON.stringify(header));
		var encodedData = getBase64(key);
		
		/*var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		var encodedHeader = base64url(stringifiedHeader);

		
		var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(key));
		var encodedData = base64url(stringifiedData);*/

		var token = encodedHeader + "." + encodedData;
		
		var secret = "74c570a558f9207faa7f56e5a63daa5f";
		var signature = CryptoJS.HmacSHA256(token, secret);
		signature = base64url(signature);
		var signedToken = token + "." + signature;
		
		/*var utf8Val = CryptoJS.enc.Utf8.parse(key);
		var base64Val = CryptoJS.enc.Base64.stringify(utf8Val);
		if(localStorage.getItem('tokenId') != null && localStorage.getItem('tokenId') != undefined){
			var token = localStorage.getItem('tokenId').split('.')[0] +"."+base64Val+ '.' + localStorage.getItem('tokenId').split('.')[2];
		}*/
		return signedToken;
    };
    
	/*Method to return base64 value.*/
	function getBase64(value){
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(value);
		var encodedHeader = base64url(stringifiedHeader);
		return encodedHeader;
	}
	
	/*Method to encode signature with regexp*/
    function base64url(source) {
	  // Encode in classical base64
	  encodedSource = CryptoJS.enc.Base64.stringify(source);

	  // Remove padding equal characters
	  encodedSource = encodedSource.replace(/=+$/, '');

	  // Replace characters according to base64url specifications
	  encodedSource = encodedSource.replace(/\+/g, '-');
	  encodedSource = encodedSource.replace(/\//g, '_');

	  return encodedSource;
	}
});