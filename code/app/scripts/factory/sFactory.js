advancePubapp.factory('sfactory',function($http,$q,$rootScope,$state,jwtEncoder,sessionService,$mdDialog){   
 
    return {
        /* Post method */
       /* serviceCall: function(request,task,isAdmin,isLoaderhidden) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
            isLoaderhidden ? $rootScope.appLoader = false : $rootScope.appLoader = true;
            $http.post(url+task,request).then(function successCallback(response) {
                if(response.status == 200){
                    if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false});
					}    
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
		
	   serviceCall: function(request,task,isAdmin,isLoaderhidden) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
		   
           isLoaderhidden ? $rootScope.appLoader = false : $rootScope.appLoader = true;
		   var token = jwtEncoder.encode(request);		   
		   $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response && response.status == 200){
                    if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false});
					}   
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
		
            return deferred.promise;
        },
		
		loginServiceCall: function(request,task,isAdmin) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
            $rootScope.appLoader = true;
		    var token = jwtEncoder.encode(request);	
			
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response.status == 200){
                    deferred.resolve(response.data);  
					localStorage.setItem('tokenId', response.data.data.tokenId);					
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
         ecomserviceCall: function(request,task,isLoader) { 
            var deferred = $q.defer();            
             var url = "http://172.24.137.114//ecommerce/webservice/service.php?method=";
            $rootScope.appLoader = !isLoader;
            var token = jwtEncoder.encode(request);
            $http.post(url+task, request).then(function successCallback(response) {
                if(response && response.status == 200){
                    console.log("media library menu accordion ->",response.data);
                    deferred.resolve(response.data);
                    /*if(response.data.sessioned){
                        deferred.resolve(response.data);    
                    }
                    else{
                        sessionService.clear();
                        $state.go('phonics');
                        $rootScope.appLoader = false;
                        $mdDialog.hide();
                    }*/   
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
/*		loginServiceCall: function(request,task,isAdmin) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
           $rootScope.appLoader = true;
            $http.post(url+task,request).then(function successCallback(response) {
                if(response.status == 200){
                    deferred.resolve(response.data);   
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
        
        /* Get method */
        getService: function(request,task) {
            var deferred = $q.defer();
             $rootScope.appLoader = true;
            var url="http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=";
            $http.get(url+task).then(function successCallback(response) {
                if(response.data.sessioned){
                    deferred.resolve(response.data);    
                }
                else{
					sessionService.clear();
                    $rootScope.appLoader = false;
                    $state.go('adminLogin',{isLoggedin:false,location: false}); 
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise; 
        },
        
        /* post call for form data method */
     /*serviceCallFormData: function(request,task,isAdmin) {
            var deferred = $q.defer();
            $rootScope.appLoader = true;
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
           $http.post(url+task,request,{ headers: {'Content-Type': undefined},transformRequest: angular.identity}).then(function successCallback(response) {
                if(response.status == 200){
                   if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}  
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
		
	  serviceCallFormData: function(request,task,isAdmin) {
            var deferred = $q.defer();
            $rootScope.appLoader = true;
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
		  
		    var token = jwtEncoder.encode(JSON.stringify(request.token));
		  
           $http.post(url+task,request.formObj,{ headers: {'Content-Type': undefined,'Authorization': token},transformRequest: angular.identity}).then(function successCallback(response) {
                if(response.status == 200){
                   if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}  
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
      
        /* ajax call to fetch local json files */
        /* This code needs to be deleted before moving app to production */
        localService: function(task) {
            var deferred = $q.defer();          
             $http({method: 'GET',url: 'app/scripts/JsonFiles/'+task+'.json'}).then(function successCallback(response) {
                deferred.resolve(response);
              }, function errorCallback(error) {
                 deferred.reject(error);
              });
            return deferred.promise;
        },
        serviceIntervalCall: function(request,task,isAdmin) {            
            var deferred = $q.defer();            
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";          
		   	var token = jwtEncoder.encode(request);
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response && response.status == 200){
                    if(response.data.sessioned){
						//var playload = JSON.parse(atob(config.headers.Authorization.split('.')[1]));
    					//console.log(playload);
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
                        $mdDialog.hide();
					}   
                }
                else{
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;           
        },
        serviceCallReports: function(request,task) {
            var deferred = $q.defer();
             $rootScope.appLoader = true;
            var url = typeof(siteAdminURL) === "undefined" ? "http://172.24.137.114/randa/" : appUrl;
            var token = jwtEncoder.encode(request);
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
				if(response.status == 200){
					if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}    
				}				
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise; 
        },
        
        bufferedData : function(){
            return{
                assignment:[],
                params:{},
                studentProfile:[],
                types : ""
            }
        }
    };  

})