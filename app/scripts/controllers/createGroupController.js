advancePubapp.controller('createGroupController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog', 'dataToPass','$filter', function($scope, sfactory, $rootScope, taskService,$state,$mdDialog, dataToPass,$filter) {
    
    var inputreq,groupId,groupName;
 
    $scope.cancel = function() {
       $mdDialog.hide({cancel:true});
     //$mdDialog.cancel();
   /*  if($scope.groupType === 'edit') {    
           $state.transitionTo('classDetails', {classid:classId, group:groupId, table: 'users'},{
                    location: true,
                    inherit: true,
                    relative: $state.$current,
                    notify: false
            });
       } else if($scope.groupType === 'add') {
           $state.go('classDetails', {classid:classId, group:groupId, table: 'users'}, {reload: true});
       }*/
    };
    
    $scope.addOrEditGroup = function(isValid){
        $scope.groupType === 'add' ? checkGroupExist(isValid) : editGroup(isValid);
    };
    
    $scope.closeBaner = function(){ 
      $scope.alertBaner.showBaner = false;
    };
    
    function checkGroupExist(isValid) {
        if (isValid) {
            var inputreq = {};
            inputreq.groupname = $scope.obj.groupname;
            inputreq.classmasterid = classId;
            tasks = taskService.getTasks("createGroupController");
            sfactory.serviceCall(JSON.stringify(inputreq),tasks.checkGroupExistance,'listDetails').then(function(response){
                if(response.status !== "fail") {
                    createGroup();
                } else {
                    $scope.err.groupErrorMsg = response.message;
                }
                $rootScope.appLoader = false;
            },function(error){
                var localTask = "groupExist";
                sfactory.localService(localTask).then(function(response){
                    if(response.status !== "fail") {
                        createGroup();
                    } else {
                        $scope.err.groupErrorMsg = response.data.message;
                    }
                    $rootScope.appLoader = false;
                },function(error){
                });
            });
        }
    };
    
	function createGroup() {
        inputreq = {};
        inputreq.groupname = $scope.obj.groupname.trim();
        inputreq.classmasterid = classId;
        tasks = taskService.getTasks("createGroupController");
        sfactory.serviceCall(inputreq,tasks.addNewGroup,'listDetails').then(function(response){
            groupId = response.data.groupid;
			response.data.groupname = inputreq.groupname;
			response.data.usercnt   = 0;
            $mdDialog.hide({response:response});
           /* setTimeout(function() {
                $state.go('classDetails', {classid:classId, group:response.data[0].groupid ,table: 'users'}, {reload: true});
            },500);*/
			setTimeout(function() {
				$state.transitionTo('adminLanding.classDetails', {classid:classId, group:response.data.groupid ,table: 'users'},{ 
					location: true,
					inherit: true,
					relative: $state.$current,
					notify: false,
					reload: false
				});
			},500);	
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "createGroup";
            sfactory.localService(localTask).then(function(response){
				$mdDialog.hide({response:response});
                //$mdDialog.hide(response);
                groupId = response.data.data.groupid;
                setTimeout(function() {
                    $state.go('adminLanding.classDetails', {classid:classId, group:response.data.groupid ,table: 'users'}, {reload: true});
                },7000);
            },function(error){
            });
        });
    };
    
    function editGroup(isValid) {
        if(isValid) {
            inputreq = {classgroupname:$scope.obj.groupname.trim(),classgroupid:groupId,classmasterid:classId}
            tasks = taskService.getTasks("createGroupController");
            sfactory.serviceCall(inputreq,tasks.editGroup,'listDetails').then(function(response){
				if($filter('lowercase')(response.status) == 'success'){ 
                     $mdDialog.hide({response:response,inputreq:inputreq});
				}else{
					$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
				}
                $rootScope.appLoader = false;
            },function(error){
            });
        }
    };
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.obj = {};
        $scope.err = {};
        $scope.notNewGroup = true;
        $scope.groupNameFlag = false;
        inputreq = {};
        classId = dataToPass.classId || dataToPass.classid;
        $scope.groupType = dataToPass.groupType;
        groupId = dataToPass.group;
        groupName = dataToPass.groupName;
        groupName ? $scope.obj.groupname = groupName : $scope.obj.groupname = '';
    };
    
    initializeController();
}]);