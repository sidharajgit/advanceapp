advancePubapp.service('cacheService', ['sfactory','$q','sharedService','$rootScope',function(sfactory,$q,sharedService,$rootScope) {
    
	/* Method for get internal cache from server side */
	var cacheData={}; 
    this.getAndSet = function (){
        var deferred = $q.defer();
        if(!angular.isDefined(cacheData.data)){
            var task = "adminGroupDetails";
            sfactory.serviceCall({},task,'adminPage').then(function(response){
                 if(response.status.toLowerCase() == 'success'){
                     cacheData.data = response.data;
                     if(response.data.profileImage.type == "others"){
                        sharedService.imageName = (response.data.profileImage.name != "") ? response.data.profileImage.url+response.data.profileImage.name : "";                         
                     }else{
                        sharedService.imageName = response.data.profileImage.url;
                     } 
                     sharedService.fullname = response.data.loggedBy;
                 }
                 $rootScope.appLoader = false;
                 deferred.resolve(cacheData.data);
             },
              function(){
                var localTask = "admingroupdetails";
                sfactory.localService(localTask).then(function(response){
                    cacheData.data = response.data;
                    if(response.data.profileImage.type == "others"){
                        sharedService.imageName = response.data.profileImage.url+response.data.profileImage.name;                        
                    }    
                    sharedService.fullname = response.data.loggedBy;
                    deferred.resolve(cacheData.data);
                },function(error){
                });
            }); 
        }else{
			deferred.resolve(cacheData.data);
		} 
        return deferred.promise;
    };
  
	/* Method for get value */
	this.get = function(key){
		return cacheData.data[key];
	};
	
	/* Method for empty object */
    this.empty = function(){
		cacheData={};
	};
	
    /* Method to set the cachedata */
	this.set = function(value){
		cacheData.data['searchkey'] = value;
	};
		
}]);
