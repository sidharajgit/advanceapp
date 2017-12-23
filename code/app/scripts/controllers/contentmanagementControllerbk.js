advancePubapp.controller('contentmanagementControllerbk',['$scope','sfactory','$rootScope','$filter','$mdDialog','taskService', function($scope,sfactory,$rootScope,$filter,$mdDialog,taskService){ 

	var userReq = {};
    var tasks;
    
    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
        $scope.isSingleuser = false;
        $scope.isMultiuser  = false;
        $scope.showicon     = args.showicon;
    });
    
    /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
        $scope.$emit('switchMenu',{list:$scope.listObj});
    };
     
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    });
    
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: 'tabDialogController',
          templateUrl: 'dest/templates/tabDialog.html',
          targetEvent: ev,
          clickOutsideToClose:true
        })
            .then(function(answer) {
            }, function() {
            });
      }; 
    
    /* Method to capture emitted values from deep child directive */
    $scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
    
	
	/* Method for tab change in content management */
    $scope.getCurrentTab = function(){
      var tabMap = {'Phonics Adventure':0,'Number Success':1};
      $scope.filteredData = $filter('filter')($scope.contentmanagement, $scope.contentSearch);
      $scope.contentTabindex = ($scope.filteredData && $scope.filteredData.length > 0) ? tabMap[$scope.filteredData[0].name] : 0;
    };
	
	/* Method for viewsectioncontent */
    $scope.viewsectioncontent = function(data){
      data.viewsection = true;
    };
  
	$scope.closecontent = function(data,$event){  
	    $event.stopPropagation();
		$event.preventDefault();
	    data.viewsection = false;
	};
    
	function initiatecontentController(){
		$scope.pagename = "contentmanagementpage";
        $scope.contentTabindex = 0; // It represents the current tab index for contents based on the search text...
        tasks = taskService.getTasks('contentmanagementController');
		var localTask = "contentmanagement";
		sfactory.serviceCall({},tasks.getContents,'listDetails').then(function(response){
			$scope.contentmanagement = response.data;  
            $scope.getCurrentTab();
			$rootScope.appLoader = false;
		},function(error){
			appLoaderCheck = true;
			sfactory.localService(localTask).then(function(response){
				$scope.contentmanagement = response.data;  
                $scope.getCurrentTab();
				appLoaderCheck = false;
			},function(error){
			});
		});
		$scope.courseHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.catGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};

		$scope.sectionHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.sectionGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};
		
		$scope.activitiesHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.scormGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};
	};

	initiatecontentController();
    
}]);

advancePubapp.animation('.animate_slider_cont', function($animate) {
 return {
    enter: function(element, done) {
        element.css('display','inline-block');
        element.animate({"max-height":'999px'},500,function(){
            element.css('overflow','visible');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.slideUp();
        element.animate({"max-height":'0'},500);
    }
  };
});