advancePubapp.controller('createClassController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog','dataToPass', '$filter','$stateParams','sessionService','encryptionService',function($scope, sfactory, $rootScope, taskService,$state,$mdDialog,dataToPass,$filter,$stateParams,sessionService,encryptionService) {
     
    $scope.existclasserr = "";
    var tasks;
    var selectedClassId;
    var inputreq;
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
     
	/* method for select particu;arrow value */
	$scope.gatherValues = function(selectedItem){
		$scope.classUser.classadmin = selectedItem.id;
    } 
		
	/* Method for edit teacher display */
	function editTeacherDisplay(){ 
		  sfactory.serviceCall('', tasks.teacherlist,"listDetails").then(function(response) {
			if($filter('lowercase')(response.status) == 'success'){
				$scope.selectedadminid = (!_.isNull(sessionService.get('teacherid'))) ? encryptionService.decrypt(sessionService.get('teacherid')) : '';
				$scope.classAdminuser = response.data;
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}
            $rootScope.appLoader = false;
        }, function(error) {
            var localTask = "allclassuserlist";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableDataadmin.data = response.data.data.data;
            }, function(error) {
            });
        });
	}
	
    $scope.addOrEditClass = function(isValid) {
         dataToPass && dataToPass.className ? $scope.editClass() : $scope.createClass('new'); 
    }
    
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
            $scope.classImage = dataURL;
            $scope.upload(dataURL);
            if (dataURL.length) {
                $scope.showDown = false;
            }
        });
    }
    
	/*Method to validate keypup event for class name*/
	$scope.classkeyup = function(name){
		if(name.length <= 25){
			return;
		}
		else{
			existclasserr=''
		}
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
    
    //function to add class
    $scope.createClass = function(type){        
		inputreq = createclassformdata(type);
        sfactory.serviceCall(inputreq,tasks.addNewClass,'listDetails').then(function(response){
			$rootScope.appLoader = false;
			if($filter('lowercase')(response.status) == 'success'){
				($scope.classUser.classname != '')	? sessionService.set('classname',encryptionService.encrypt($scope.classUser.classname)) : '';
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
				setTimeout(function(){
					$mdDialog.cancel();
					$state.go('adminLanding.classDetails',{table:"users",classid:response.data.classmasterid,name:$scope.classUser.classname});
				},3000)
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}			
        },function(error){
            var localTask = "createClass";
            sfactory.localService(localTask).then(function(response){
                $state.go('adminLanding.classDetails',{table: "users", classid: '100', name:$scope.classUser.classname});
            },function(error){
            });
        });
    } 
	
	function createclassformdata(type){
		inputreq = {};
		if(type == 'new'){
			inputreq.classname     = $scope.classUser.classname;
			inputreq.email1        = $scope.classUser.email1;
			inputreq.firstname 	   = $scope.classUser.firstname;
			inputreq.gender        = $scope.classUser.gender;
			inputreq.lastname      = $scope.classUser.lastname;
			inputreq.phone_no      = $scope.classUser.phone_no;
			inputreq.username      = $scope.classUser.username;
			inputreq.profilepic    = $scope.uploadedFile;
		}else{
			inputreq.classname     = $scope.classUser.classname;
			inputreq.profilepic    = $scope.uploadedFile;
			inputreq.classadmin    = $scope.classUser.classadmin;
		}
		return inputreq;
	}
    
	$scope.checkClassExist = function() {
		var inputreq = {};
		inputreq.classname = $scope.classUser.classname;
		sfactory.serviceCall(inputreq,tasks.checkClassExistance,'listDetails').then(function(response){
			if(response.status !== "fail") {
				$scope.existStudent = true;  
			} else {
				$scope.existclasserr = response.message;
			}
			$rootScope.appLoader = false;
		},function(error){
			var localTask = "classExist";
			sfactory.localService(localTask).then(function(response){
				if(response.data.status !== "fail") {
					createClass();
				} else {
					$scope.existclasserr = response.data.message;
				}
				$rootScope.appLoader = false;
			},function(error){
			});
		});
    }
    
    $scope.editClass = function(isValid){
        inputreq = {};
        inputreq.classmasterid = selectedClassId;
        inputreq.classname = $scope.classUser.classname.trim();
        inputreq.profilepic = $scope.uploadedFile;
		inputreq.adminid = $scope.classUser.adminid;
        sfactory.serviceCall(inputreq,tasks.editClass,'listDetails').then(function(response){
            if(response.status !== "fail") {
			($scope.classUser.adminid != '') ? 	sessionService.set('teacherid',encryptionService.encrypt(String($scope.classUser.adminid))) : '';
			($scope.classUser.classname != '')	? sessionService.set('classname',encryptionService.encrypt($scope.classUser.classname)) : '';
            var responseData = {
                response : response,
                editedClassName : inputreq.classname
            }
			$mdDialog.hide(responseData);
            }else{
                $scope.existclasserr = response.message;
            }
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "createClass";
            sfactory.localService(localTask).then(function(response){
                sessionService.set("classname",$scope.classUser.classname);
                $state.go('adminLanding.classDetails',{table:"users",classid:selectedClassId}, {reload:true});
                $rootScope.appLoader = false;
            },function(error){
            });
        });
    };     
    
    /* Method to initialize Controller */
    function init() {
		$scope.classUser = {};
		tasks = taskService.getTasks("createClassController");
        dataToPass && dataToPass.className ? $scope.classUser.classname = dataToPass.className : $scope.classUser.classname = '';
        dataToPass && dataToPass.classId ? selectedClassId = dataToPass.classId : '';
        $scope.classType = dataToPass.classType;
        $scope.classImage = dataToPass.classImg;
        setTimeout(function () {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        });
		editTeacherDisplay();
    };
	
	init();
    
}]);