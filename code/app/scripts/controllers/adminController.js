advancePubapp.controller('adminController',['$scope','sfactory','$state','$rootScope','$stateParams','encryptionService','sessionService',function($scope,sfactory,$state,$rootScope,$stateParams,encryptionService,sessionService){ 
        
    /* Method to login into admin Controlpanel page */ 
    $scope.submit_login_admin=function(){
		if(angular.isDefined($scope.admin.admin_username) && angular.isDefined($scope.admin.admin_password) && $scope.admin.admin_username != '' && $scope.admin.admin_password != ''){
			var serRequest = JSON.stringify({username:$scope.admin.admin_username ? $scope.admin.admin_username : '',password:$scope.admin.admin_password ? encryptionService.encrypt($scope.admin.admin_password) : ''});
			var task = "adminLogin";
			$scope.appLoader = true;
			sfactory.loginServiceCall(serRequest,task,'adminPage').then(function(response){
				if(response.status=='success'){
					
					sessionService.set('session_Id',encryptionService.encrypt(response.data.sessionId));  
                    sessionService.set('sessionExpired',encryptionService.encrypt(String(response.data.sessionExpired)));
					$scope.appLoader = false;
					$scope.admin ={sessionedAdmintype:response.data.adminType ? response.data.adminType : adminType, grpId:response.data.groupTypeId ? response.data.groupTypeId : null,loggedBy:response.data.loggedBy} ;
					$scope.alertBaner = {message:response && response.message && response.message != '' ? response.message : "Authenticated Successfully",banerClass:'alert-success',showBaner:true};
					$scope.isLoggedin = true;
					if(response.data.adminType && response.data.adminType.toLowerCase() == 'superadmin'){
						$state.go('groupdashboard',{isLoggedin:true,location: false});
					}
					else{
						var serRequest = {};
						var task = "loggedUserdetails";
						sfactory.serviceCall(serRequest,task,'adminPage').then(function(response){
							 if(response.status.toLowerCase() == 'success'){
                                 /*requestcheck= {
                                    'group_id'  : response.data.groupTypeId,
                                    'sessionId': response.data.sessionId
                                };
                                sfactory.serviceCallReports(requestcheck,'setreportssession').then(function(response){
                                    if(response.status=='success'){                        
                                        $state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false});  
                                    }

                            },function(error){
                                
                            });*/
                                 sessionService.set('userId',encryptionService.encrypt(String(response.data.userId)));
                                 sessionService.set('role',encryptionService.encrypt(String(response.data.roleType)));
                                 $state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false});
                                 $rootScope.appLoader = false;
				          }
							 
						 },
						  function(){
							  $rootScope.appLoader = false;
						 });
					}

				}else{
					$scope.admin = {};
					$scope.appLoader = false;
					$scope.alertBaner = {message:(response && response.message && response.message != '' ? response.message : 'check username & password'),banerClass:'alert-danger',showBaner:true};
				}
				$rootScope.appLoader = false;
			},function(error){
				$scope.appLoader = false;
			});
		}
    }
        
    /* Method to show/hide password */
    $scope.showPwdChange = function(){
        if($scope.showPwd == 'text') $scope.showPwd = 'password';
        else if($scope.showPwd == 'password') $scope.showPwd = 'text';
    };
    
    /* Method to reset password */
    $scope.forgotPwd = function(){
      $scope.isForgotpwd = true;
    };
    
    /* Method to navigate to admin page */
    $scope.setbackTosignin = function(event){
        event.preventDefault(); 
        $scope.isForgotpwd = false;
        $scope.admin.adminMail = "";
    };
    
    /* Method to reset admin password */
    $scope.resetAdminPwd = function(){
        var forgotPwdRequest = JSON.stringify({email:$scope.admin.adminMail});
        var task = "register.forgotpassword"; 
        $scope.appLoader = true;
        sfactory.loginServiceCall(forgotPwdRequest,task).then(function(response){
            if(response.status=='success'){
                $scope.alertBaner = {message:response && response.message && response.message != '' ? response.message : "Password reset link sent to mail successfully",banerClass:'alert-success',showBaner:response.message ? true : false};
                $scope.isForgotpwd = false;
                
            }else{
                $scope.alertBaner = {message:(response && response.message && response.message != '' ? response.message : 'Incorrect username/email id.'),banerClass:'alert-danger',showBaner:response.message ? true : false};                
            }
			$rootScope.appLoader = false;
            $scope.appLoader = false;
        },function(error){
           
            $scope.appLoader = false;
        });
    };
    
    /* Method to close alert baner */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
        
 	function initializeController(){
		//Method for local calls only
		if(typeof(siteAdminURL) == "undefined"){
			$scope.isLoggedin = true;
			var serRequest = {};
			var task = "loggedUserdetails";
			sfactory.localService(task).then(function(response){
				 if(response.data.status.toLowerCase() == 'success'){
                     sessionService.set('userId',encryptionService.encrypt("1"));
                     sessionService.set('role',encryptionService.encrypt(response.data.data.data[0]['roleType']));
					if(response.data.data.data[0]['adminType'] == 'superAdmin'){                        
						$state.go('groupdashboard',{loggedUserDetails:response.data,location: false}); 
					}else if(response.data.data.data[0]['adminType'] == 'groupAdmin'){
						$state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false}); 
					} 
					
				 }
				 $rootScope.appLoader = false;
			 },
			  function(){
				  $rootScope.appLoader = false;
			 });
		}	
        if($stateParams.isLoggedin){
          $scope.isLoggedin = $stateParams.isLoggedin;
        }
        $scope.showPwd = "password";
        $scope.isSuccessLogin = false;
        $scope.admin = {};
        $scope.loginImage = templateURL+"dest/images/loginlft.png";
    };
    
    initializeController();
}]);