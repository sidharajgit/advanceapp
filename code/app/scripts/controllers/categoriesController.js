advancePubapp.controller('categoriesController',['$scope','$state','$http','$httpParamSerializer','spinnerService','sfactory','$rootScope', function($scope,$state,$http,$httpParamSerializer,spinnerService,sfactory,$rootScope){
    $scope.alertmsg=""; 
    $scope.showvalue="ng-hide";    
    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
        $scope.showform = args.showform;
        $scope.showicon = args.showicon;
    });
    
    /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
		$scope.alertBaner.showBaner = false;
    }
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
	
	 $scope.$on('emitFromdeleteBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        initiateController(); 
    })
    
    initiateController();
    /* Method to initiate controller scope properties */
    function initiateController(){
        $scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
        $scope.tableData = {
            isFilterbtns:false,
            isSearch:true,
            isPagination:true,
			ismultiDel:{task:'coursecat.catgoriesDel',viewname:'categories'},
            childTemplate:templatepath+'editCategory.html',
            headers:[
                {name:'Category Name',bind_val:'name',isSortable:true},
                {name:'Description',bind_val:'description',isSortable:true,isDescColumn:true},
                {name:'Course',bind_val:'coursecnt',isSortable:true},
                {name:'User',bind_val:'courseusercnt',isSortable:true},
                {name:'Group',bind_val:'coursegroupcnt',isSortable:true},
                {name:'Status',bind_val:'block',isSortable:false,isStatusColumn:true,actionMethods:{status:{api:'coursecat.catgoriesActDeAct',viewName:'categories'}}},
                {name:'Actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addeditview",ishideViewbtn:true,actionMethods:{delete:{api:'coursecat.catgoriesDel',viewName:'categories'}}}
            ],
            data:[]
        }
        var categoryReq ={} ;
        var task = "coursecat.catgoriesList&catAction=CatList&catId=1";
        /* Method to fetch user details */
        sfactory.serviceCall(categoryReq,task).then(function(response){
            $scope.tableData.data = response.data;	
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "allcategorylist";
            sfactory.localService(localTask).then(function(response){
                $scope.tableData.data = response.data.data.data;
            },function(error){
            });
        });
        $rootScope.appLoader = false;
    }

    /* Method to add category from list */
    $scope.submitcategoryForm=function(details)
    { 
        $scope.category_name=details.category_name;
        $scope.comment=details.comment;
        if(!$scope.comment){
            $scope.showvalue="ng-show";   
        }else{
			$scope.showvalue="ng-hide";      
			var task="coursecat.catgoriesAdd";
			$scope.categorydata={"catAction":'catAdd',"courseCatId":'0',"courseCatName":details.category_name,"courseCatDesc":details.comment};  
			var data = JSON.stringify($scope.categorydata);  
			sfactory.serviceCall(data,task).then(function(response){
            $scope.categorydata.id=response.data;
            var categorypushdata =  $scope.pushModeldata($scope.categorydata);
            $scope.tableData.data.splice(0, 0, categorypushdata);    
            $scope.showform = false;
            $scope.showicon = true;
            $scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
        },function(error){
            $scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
        });   
        }
    }
    
     $scope.$on('editvalues', function(event, catdata) { 
        var task="coursecat.catgoriesUpdate";
		var data = JSON.stringify({"catAction":'catEdit',"courseCatId":catdata.edit.id,"courseCatName":catdata.edit.name,"courseCatDesc":catdata.edit.description});  
		sfactory.serviceCall(data,task).then(function(response){
           // $scope.clicktable2();
			var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
			$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        },function(error){
            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        });    
    });

	$scope.pushModeldata= function(item){
		return  { id:item.id,
		name:item.courseCatName,
		description:item.courseCatDesc,
		visible:"1",
		visibleold:"1",
		coursecnt:"0 course",
		courseusercnt:"0 User",
		coursegroupcnt:"0",
		row_Checkbox:false
		}
	}      
}]);

advancePubapp.filter('trusted', ['$sce', function($sce) {
    var div = document.createElement('div');
    return function(text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}])
 
