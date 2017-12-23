advancePubapp.factory('sessionInterceptor',['$window', function($window){
  
  var sessionInjector = {
        request: function(config) {
            if((config.url).indexOf("adminLogin") === -1){
				session_Id = $window.sessionStorage.getItem('session_Id');	
				grp_id = $window.sessionStorage.getItem('grp_id');	
                config.headers['sessionId'] = session_Id;
				if(grp_id){
					 config.headers['group_id'] = grp_id;
				}
            }
            return config;
        }
    };
    return sessionInjector; 
}]);

/*
advancePubapp.factory('stateService',function() {
  return {
	 myState: "foo"
  }
})
advancePubapp.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);*/


advancePubapp.factory('sharedService',function() {
  return {
	 imageName: "No image",
     fullname: "User, fullname"
  }
});
