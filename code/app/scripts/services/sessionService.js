advancePubapp.service('sessionService', ['$window','encryptionService',function($window,encryptionService) {
 
    /* Method for set sessionstorage */
    this.set = function(key,value){
        $window.sessionStorage.setItem(key,value);
    };
    
    /* Method for get sessionstorage */
	this.get = function(key){
		return $window.sessionStorage.getItem(key);	
	};
    
    /* Method for set sessionstorage with encription */
    this.setData = function(key,value){
        $window.localStorage[key] = encryptionService.encrypt(JSON.stringify(value));
    };
    
    /* Method for get sessionstorage with decription */
	this.getData = function(key){
		if($window.localStorage[key] != null){	
			return encryptionService.decrypt($window.localStorage[key]);
		}
        else{
            return null;
        }
	};
    
    this.emptyData = function(key){
		$window.localStorage.removeItem(key);
	};
    
	/* Method for clear value */
	this.clear =function(){
		angular.forEach($window.sessionStorage, function (item,key) {
			$window.sessionStorage.removeItem(key);
        });
	};
    
	this.empty = function(key){
		$window.sessionStorage.removeItem(key);
	} 
}]);  