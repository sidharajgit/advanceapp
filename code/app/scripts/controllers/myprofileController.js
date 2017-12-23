advancePubapp.controller('myprofileController',['$scope','sfactory','$rootScope','$filter','$state','sessionService','encryptionService','sharedService','taskService',function($scope,sfactory,$rootScope,$filter,$state,sessionService,encryptionService,sharedService,taskService){ 
    
    var tasks;
    
    $scope.update_adminprofile = function(){
        if($scope.studentProfile){
            password = ($scope.userdetails.new_password != '') ? encryptionService.encrypt($scope.userdetails.new_password) : "";
        }else{
            password = ($scope.userdetails.old_password != '' && $scope.passcheck) ? encryptionService.encrypt($scope.userdetails.new_password) : "";
        }
        
        var editRequest = {
            user_username:$scope.userdetails.username,
            firstname : $scope.userdetails.firstname,
            lastname  : $scope.userdetails.lastname,                                   
            user_id   : $scope.userdetails.userid,
            email     : $scope.userdetails.email,
            phoneno   : $scope.userdetails.phone_no,
            password  : password,
            address   : ($scope.userdetails.address ? $scope.userdetails.address : ''),
            dob: $scope.userdetails.dob,
			gender: $scope.userdetails.gender,
            userprofileimage : $scope.userdetails.updateprofileimageName,
            userprofileimagefile : $scope.userdetails.updateprofileimagePic,
			roleType : $scope.userRoleType
        }
        var task = "user.updateUserdetails";
        var formToken = {'token':editRequest,'formObj':JSON.stringify({'croppedimage' : $scope.dataURLsa})}; 
        sfactory.serviceCallFormData(formToken,task,"listDetails").then(function(response){            
            if($filter('lowercase')(response.status) == 'success'){				
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'}; 
				sessionService.set("menuIndex","0");
				if(response.data.profile_pic && response.data.profile_pic != '' && $scope.dataURLsa && !$scope.studentProfile){
					//set new one
					sessionService.set('profile_pic',response.data.profile_pic);
					sessionService.set('profile_picurl',response.data.profile_picurl);
					
					//get new one
					$scope.profile_pic = sessionService.get('profile_pic');
					$scope.profile_picurl = sessionService.get('profile_picurl');
					
					sharedService.profile_pic    = $scope.profile_pic;
					sharedService.profile_picurl = $scope.profile_picurl ;
                    
				}
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                $scope.alertBaner = banerData;
            }
			$rootScope.appLoader = false;
        },function(error){
                var banerData = {'message':"User details has been updated successfully.!",'showBaner':true,'banerClass':'alert-success'};
                $scope.alertBaner = banerData;
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                $scope.cacheServiceData.imageName = $scope.userdetails.updateprofileimageName;
                $scope.cacheServiceData.fullname = $scope.userdetails.firstname+","+$scope.userdetails.lastname;
        });
    } ;
    
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;$scope.alertBaner.timeout = 0;
        $scope.updateuserprofilecancel();
    };
    
    /* Method to validate user email */
    $scope.validateEmail = function(){
		var dataRequest = {};
        $scope.myprofile.emailError = false;
        if(angular.isDefined($scope.userdetails.email) && ($scope.userdetails.email !== "")) {
			dataRequest = {email1:$scope.userdetails.email,userId:$scope.userdetails.userid};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.myprofile.emailError = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    
    $scope.updateuserprofilecancel = function(){
        $state.go(encryptionService.decrypt(sessionService.get('previousState')));   
    };
    
    /* Method for image upload */
    $scope.uploadedit = function(file) {
        if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "jpg" || $scope.fileExt == "jpeg" || $scope.fileExt == "gif" || $scope.fileExt == "png"){
                $scope.imageextensionerror = "";
                $scope.userdetails.updateprofileimagePic = file;  
                $scope.userdetails.updateprofileimage = file.name;
                $scope.userdetails.updateprofileimageName = file.name;
                $scope.userdetails.userdetailspicturecancel = 'dest/images/no_image.png';
                $scope.imageextension      = false;
            }else{
                $scope.imageextensionerror = "please choose valid file";
                $scope.imageextension      = true;
                $scope.userdetails.updateprofileimagePic = "";
                $scope.userdetails.updateprofileimageName = "";
                $scope.userdetails.userdetailspicturecancel = 'dest/images/no_image.png';
            }
            
        }else{
            $scope.imageextension      = false;
            $scope.userdetails.userdetailspicturecancel = {};
            $scope.userdetails.userdetailspicturecancel = $scope.userdetails.updateprofileimagePic.$ngfBlobUrl;
        }
    };
    
    $scope.oldpasswordcheck = function(){
        params = {"old_password": encryptionService.encrypt($scope.userdetails.old_password)};
        sfactory.serviceCall(JSON.stringify(params),"user.passwordValidCheck","listDetails").then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.passcheck = true;                
                $rootScope.appLoader = false;
            }else{
                $scope.passcheck = false;                
                $rootScope.appLoader = false;
            }            
        },function(){
            $scope.passcheck = true; 
        });
    };
    
    /* On New password change check same as old */
    $scope.newpasswordcheck = function(){
        params = {"old_password": encryptionService.encrypt($scope.userdetails.new_password)};
        sfactory.serviceCall(JSON.stringify(params),"user.passwordValidCheck","listDetails").then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.newpasscheck = false;                
                $rootScope.appLoader = false;
            }else{
                $scope.newpasscheck = true;                
                $rootScope.appLoader = false;
            }            
        },function(){
            $scope.newpasscheck = true; 
        });
    };
    
    $scope.reset_pwd = function(){
        $scope.shwpwddiv = !$scope.shwpwddiv;
        $scope.reset_pwd_visible = !$scope.reset_pwd_visible;
        $scope.userdetails.old_password = "";
        $scope.userdetails.new_password = "";
    };
    
    $scope.blockingObject = {
        block: true
    };
    
    $scope.hidepopup = function () {
        $scope.showDown = false;
    };
    
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            
            if(dataURL.length)
            {$scope.showDown = false;}
        });
    };

    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        if(file){
            fileExt = file.name.split(".").pop();
            if(fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif" || fileExt == "png"){
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function ($scope) {
                        $scope.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }else{
                $scope.hidepopup();
                var banerData = {message:"Please choose valid image",showBaner:true,banerClass:'alert-danger'};  
                $scope.alertBaner = banerData;
                $scope.$apply();
            }        
        }
    };
    
    function initiateController(){
        tasks = taskService.getTasks("myProfileController");
        $scope.$emit('selectedTab',{'index':-1});
        $scope.templatepath = templateURL ? templateURL : '';
        $scope.cacheServiceData = sharedService;
        $scope.alertBaner;
        $scope.userdetails = myprofile = {};
        $scope.myprofile = {emailError:false};
        $scope.reset_pwd_visible = false;       
        $scope.currentYear = new Date().getFullYear();        
        $scope.userRoleType = sessionService.get('role');
        $scope.passcheck = true; 
        $scope.newpasscheck = true; 
        $scope.showDown = false;
        $scope.myCroppedImage = '';
        $scope.myImage = '';
        $scope.studentProfile = false;
        $scope.emailError ='';
        $scope.isMyProfile = angular.isUndefined($scope.selection);
        var isStudentAndNotSelfsigned = (angular.lowercase(sessionService.get('role')) === 'student') && (sessionService.get('isselfassigned') === "false");
        $scope.isStudentAndSelfsigned = !$scope.isMyProfile;
        $scope.isDisableFields  = false;
        
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        if(sfactory.bufferedData.types == "student"){ 
            $scope.userdetails = sfactory.bufferedData.studentProfile; //for student profile, if user comes from student profile page
            $scope.userdetails.userid  = $scope.userdetails.id;
            $scope.studentProfile = true;
            if($scope.userdetails.profile_pic != ""){
                $scope.profileimage = $scope.userdetails.profile_picurl+$scope.userdetails.profile_pic;
                $scope.userdetails.updateprofileimageName = $scope.userdetails.profile_picurl+$scope.userdetails.profile_pic;
            }else{
                $scope.profileimage = templateURL+'dest/images/no_image.png';
                $scope.userdetails.updateprofileimageName = "No Image";
            }
             _.each($scope.userdetails, function(item){
                    $scope.userdetails.roleName = "Student";
             });
            return;
        }else{
            sfactory.serviceCall(myprofile,"user.admin_settings","listDetails").then(function(response){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.userdetails = response.data;
                    $scope.userdetails.old_password = "";
                    if($scope.userdetails.profile_pic != ""){
                        if($scope.userdetails.profilepic.type == 'others'){
                            $scope.profileimage = $scope.userdetails.profilepic.url+$scope.userdetails.profilepic.name;
                            $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                        }else{
                            $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                        }

                    }else{
                        $scope.profileimage = templateURL+'dest/images/no_image.png';
                        $scope.userdetails.updateprofileimageName = "No Image";
                    }
                    $rootScope.appLoader = false;
                }            
            },function(){
                sfactory.localService("usereditprofile").then(function(response) {
                    $scope.userdetails = response.data.data;
                    $scope.userdetails.old_password = "";
                    if($scope.userdetails.profile_pic != ""){
                        $scope.profileimage = $scope.userdetails.profilepic.url+$scope.userdetails.profilepic.name;
                        $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                    }else{
                        $scope.profileimage = 'dest/images/no_image.png';
                        $scope.userdetails.updateprofileimageName = "No Image";
                    }

                }, function(error) {
                });
            });
        }

    //$scope.dashboard.breadCrumbList =["My Profile"];   
    };
    initiateController();
}]);