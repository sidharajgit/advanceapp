advancePubapp.controller('modalclassparentController',['$scope','$http','$state','userassigntoparent','sfactory','$filter','$rootScope','$mdDialog',function($scope,$http,$state,userassigntoparent,sfactory,$filter,$rootScope,$mdDialog){
	
	//Method for cancel parent list
	$scope.parent_link_cancel = function() {
		if(angular.isDefined($scope.parentname)){
			$mdDialog.hide($scope.parentname);
		}else{
			$mdDialog.cancel();
		}
		
    };
	
	$scope.parentvalueupdate = function(event){
		$scope.parentname = (event.username.val == true)?event.username.username:"";
	}
	
	$scope.userassigntoparent = userassigntoparent;
	event.preventDefault();
	inputReq = {
		'userid'     : userassigntoparent.userid
	};
	var task = 'classes.parentList';
	sfactory.serviceCall(userassigntoparent, task,"listDetails").then(function(response) {
		if(angular.isDefined(response)){
			if($filter('lowercase')(response.status) == 'success'){
				$scope.tableDataParentLinktoUser.data = response.data;
			}
			$rootScope.appLoader = false;
		}
	}, function(error) { 
	  
	});	    
		
	//Method for initiate controller call
	function initiatemodalController(){
		$scope.tableDataParentLinktoUser = {
		pageName:'classeditparentlink',
		isFilterbtns: false,
		isSearch:false,
		isCheckboxhide:true,
		isPagination:true,
		sortType:'name',
		headers:[
			{name:'Name',bind_val:'name',isSortable:true},
			{name:'user name',bind_val:'username',isSortable:true},
			{name:'status',bind_val:'parentadd',isSortable:false,isActionColumn:true,columnName:"linktoparent",actionName:'classes.addParent',apiParams:{'userid':userassigntoparent.userid,'action':null,'parentid':null},'isParentlink':true},
		],  
		data:[]
		} 
	}	
	
	//Method for initiate controller
	initiatemodalController();
}]);