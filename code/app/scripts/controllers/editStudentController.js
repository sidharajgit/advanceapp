advancePubapp.controller('editStudentController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state', '$stateParams','cacheService','$mdDialog', 'dataToPass', 'previousState', '$filter', function($scope, sfactory, $rootScope, taskService,$state,$stateParams,cacheService, $mdDialog, dataToPass, previousState, $filter) {
    
    var tasks;
    var inputreq;
    var userName;
    var email;
    var userId;
    $scope.user = {};
    $scope.currentYear = new Date().getFullYear();
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
    
    /* Method on change of email */                                                                                          
    $scope.validateEmail = function(){
        var dataRequest = {};
        $scope.useremailexist = false;
        if(angular.isDefined($scope.user.email) && ($scope.user.email !== "")) {
			dataRequest = {email1:$scope.user.email,userid:userId};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.useremailexist = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    /* Method to initialize Controller */
    function initializeController() {
        
		tasks = taskService.getTasks("editStudentController");
		/* Method for set profile pic if there is no imgae*/
				
        if(dataToPass) {
            userName = dataToPass.username;
            email = dataToPass.email;
            userId = dataToPass.id;
            $scope.user.firstname = dataToPass.firstname;
            $scope.user.lastname = dataToPass.lastname;
            $scope.user.username = dataToPass.username;
            $scope.user.phone_no = dataToPass.phone_no;
            $scope.user.address = dataToPass.address;
            $scope.user.roaming = dataToPass.roaming_content;
            $scope.user.gender = dataToPass.gender;
			$scope.user.dob = dataToPass.dob;
            $scope.user.email = dataToPass.email;
            $scope.studentProfilePic = (dataToPass.profile_pic != "") ? dataToPass.profile_picurl + dataToPass.profile_pic : templateURL+'dest/images/noimage.png';
        }
        setTimeout(function () {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        });
    };
     
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $scope.hide();
    };
     
    $scope.hidepopup = function () {
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            $scope.studentProfilePic = dataURL;
            $scope.upload(dataURL);
            if (dataURL.length) {
                $scope.showDown = false;
            }
        });
    }
    
    //Method for image upload
    $scope.upload = function(file) {
        $scope.uploadedFile = file;
    }
    
    $scope.blockingObject.callback = function (dataURL) {
        
    }
    
    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    
    function createRequestObj() {
        inputreq = {};
        inputreq.firstname = $scope.user.firstname;
        inputreq.lastname = $scope.user.lastname;
        inputreq.username = userName;
        inputreq.phoneno = $scope.user.phone_no;
        inputreq.address = $scope.user.address;
        inputreq.user_id = userId;
        inputreq.password = $scope.user.password;
        inputreq.dob = $scope.user.dob;
        inputreq.roaming_content = $scope.user.roaming;
        inputreq.gender = $scope.user.gender;
        inputreq.email1 = $scope.user.email;
        inputreq.roletype = 5;
        //inputreq.profilepic = $scope.uploadedFile;
    }
    
    $scope.editUser = function() {
        createRequestObj();
        tasks = taskService.getTasks("editStudentController");
        var formToken = {'token':inputreq,'formObj':JSON.stringify({'profilepic' : $scope.uploadedFile})}; 
        sfactory.serviceCallFormData(formToken,tasks.editStudent,'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                studenTableUpdate(response);
                $rootScope.appLoader = false;
                $mdDialog.hide(response);
            } else {
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                $scope.alertBaner = banerData;
            }
        },function(error){
            var localTask = "editStudentSuccess";
            sfactory.localService(localTask).then(function(response){
                $mdDialog.hide(response);
                previousState.reload();   
                $rootScope.appLoader = false;
            },function(error){
            });
        });
    }
	
	function studenTableUpdate(response){
		dataToPass.firstname = inputreq.firstname;
		dataToPass.lastname  = inputreq.lastname;
		dataToPass.phone_no  = inputreq.phoneno;
		dataToPass.address   = inputreq.address;
		dataToPass.gender    = inputreq.gender;
        dataToPass.email    = inputreq.email;
	    dataToPass.roaming_content = inputreq.roaming_content;
		dataToPass.name      = inputreq.firstname+' '+inputreq.lastname;
		dataToPass.dob  = angular.isDefined(inputreq.dob)?inputreq.dob:"";
		dataToPass.profile_pic  = (response.data.profile_pic)?response.data.profile_pic:"";
		dataToPass.profile_picurl  = (response.data.profile_picurl)?response.data.profile_picurl:"";
        
	}
    
    initializeController();
}]);