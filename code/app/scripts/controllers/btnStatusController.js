advancePubapp.controller('btnStatusController',['$scope','sfactory','getParamsstatus','$mdDialog','$filter','$rootScope', function($scope,sfactory,getParamsstatus,$mdDialog,$filter,$rootScope){ 
         
    /* Method to get class names for user type buttons */
    $scope.getClassnames = function(){
        if($scope.contentBody[$scope.contentHead.bind_val] === 'Group Admin'){
			$scope.contentBody[$scope.contentHead.bind_val] = 'Groupadmin';
		}
        return 'user_type_icon_'+$scope.contentBody[$scope.contentHead.bind_val];
    }
     
    /* Method to activate category from list */
    $scope.statusField = $scope.contentBody.block != undefined ? $scope.contentBody.block : $scope.contentBody.visible;
    $scope.stateLevel = $scope.statusField;
    $scope.statusChange = function() {
        var stateTitle = !$scope.contentBody.block ? 'Are you sure you want to deactivate?' : 'Are you sure you want to activate?';
        var confirm = $mdDialog.confirm()
              .title(stateTitle)
              .textContent()
              .ariaLabel()
              .ok('Ok')
              .cancel('Cancel'); 
        
        $mdDialog.show(confirm).then(function(result) {
          $scope.status = '';
            $scope.contentBody.showChild = false;
            $scope.contentBody.viewChild = false;
			
			if($scope.contentHead.actionMethods.status.viewName == "adminclassDashboard"){
				bindparam = $scope.contentBody.roaming_content;
			}else{
				bindparam = $scope.contentBody.block;
			}
			
            var statusAction = getParamsstatus.args($scope.contentHead,$scope.contentBody.id,bindparam,$scope.contentBody);
            var sessionBasedcall = ($scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status) ? $scope.contentHead.actionMethods.status.session : null;
            if(statusAction.params){   
                sfactory.serviceCall(JSON.stringify(statusAction.params),statusAction.api,'listDetails').then(function(response){
                    if($filter('lowercase')(response.status) == 'success'){
						//Method for content management status changes 
						if($scope.contentHead.actionMethods && $scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status.api == 'content_v2.catGroupAssign'){
							contentcatagoryaction();
						}else if($scope.contentHead.actionMethods && $scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status.api == 'content_v2.sectionGroupAssign'){
							contentlessonsaction($scope.contentBody.lessons);
						}
						else{
							if($scope.contentHead.actionMethods.status.viewName == "usernonactivate"){
								 nonactiveindex = _.findIndex($scope.contentItems,{id:statusAction.params.id});
								(nonactiveindex != -1) ? $scope.contentItems.splice(nonactiveindex,1) :"";
							}
							else if($scope.contentHead.actionMethods.status.viewName == "adminclassDashboard"){
								$scope.contentBody.roaming_content = response.data.block;
								$scope.statusField = response.data.roaming_content;
							}else{
								$scope.contentBody.block = response.data.block;
								$scope.statusField = response.data.block;
							}
						}
						$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':$scope.contentItems}});
						
                    }else{
                        if($scope.contentBody.block){
                            $scope.contentBody.block = false;
                        }else{
                            $scope.contentBody.block = true;
                        }
                        $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-danger','contentItems':$scope.contentItems}});
                    }
					$rootScope.appLoader = false;
                },function(error){
                    //$scope.contentItems.push($scope.contentBody);
                    $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':$scope.contentItems}});
                });
            }
        }, function() {
            
           $scope.status = '';
            
            if($scope.contentBody.block){
                $scope.contentBody.block = false;
            }else{
                $scope.contentBody.block = true;
            }
			
			//roaming content activation deactivation
			if($scope.contentBody.roaming_content){
                $scope.contentBody.roaming_content = false;
            }else{
                $scope.contentBody.roaming_content = true;
            }
        });
    };
	
	//Method for content management status changes 
	function contentcatagoryaction(){
		_.find($scope.contentBody.sections, function(section) {
			section.block = $scope.contentBody.block;
			contentlessonsaction(section.lessons);
		})						
	}
	
	//Method for content management status changes 
	function contentlessonsaction(lessons){
		_.find(lessons, function(lesson) { 
			lesson.block = $scope.contentBody.block;
			_.find(lesson.activities, function(activity) { 
				activity.block = $scope.contentBody.block;
			})
		})
	}
}]);