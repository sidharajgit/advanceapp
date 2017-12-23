advancePubapp.factory('sessionValidator',function($http,$q,$rootScope,$cookies,$state,$stateParams){ 	
return {
        /* Post method */
        fetchData: function() {   
            if(typeof(siteAdminURL) == "undefined"){
                 /* Code needs to be un commented in local dev environement only */
                var adminType = "groupAdmin"; // groupAdmin for sommer and abc group admins. superAdmin only for super users ...    
                $cookies.put('isAdminLoggedIn',"true");
                $cookies.put('adminType',adminType);
                $cookies.put('groupTypeId',"108");
                $cookies.put('groupType','true'); 
            }
            var session = $cookies.get('isAdminLoggedIn'); 
            var sessionType = {sessionedAdmintype:$cookies.get('adminType'),grpId:$cookies.get('groupTypeId') ? $cookies.get('groupTypeId') : null};
            var defer = $q.defer();
            if(session){
                defer.resolve(sessionType);
            }
            else{
                defer.reject();
            }
            return defer.promise;
        }
    }

});  