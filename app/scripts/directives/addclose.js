advancePubapp.directive('crossicon', ['$rootScope', function ($rootScope) {
      
    return {
        restrict: 'E',
        templateUrl:templateURL+"dest/templates/addClose.html",
		scope: {
			tableData: '=',
			tableType:'=',
			addRecord: '=',
			crossButton: '=',
			onLoadCallback : '&' 
		}, 
        link: function(scope, element, attrs) {
            var addSinlge = {usermanagement:'Add User',classmanagement: 'Add Class'};
            var addMulti  = {usermanagement:'Add Multiple Users',classmanagement: 'Assign Content'};
            scope.addName = {
                addSingleName:addSinlge[scope.tableData.pageName],addMultiuploadname:addMulti[scope.tableData.pageName]
            };
			scope.crossButton = {};
			scope.hideAllviews = function(){
				_.each(scope.tableData.data,function(item){
					item.viewChild =  false;
					item.showChild =  false;
					item.isEditable = false;
                    item.isAddCourse = false;
                    item.isAddUser = false;
				});
			}
            scope.toggleSingleuser = function(){
                scope.crossButton.isSingleuser = true;
                scope.crossButton.isMultiuser  = false;
				scope.hideAllviews();
				usertype = {'isSingleuser':scope.crossButton.isSingleuser};
				scope.onLoadCallback({arg1: usertype});
            } 
            scope.toggleMultiuser = function(){
                scope.crossButton.isSingleuser = false;
                scope.crossButton.isMultiuser = true;
				scope.crossButton.isTeacherTab = true;
				scope.hideAllviews();
				usertype = {'isMultiuser':scope.crossButton.isMultiuser};
				scope.onLoadCallback({arg1: usertype});				
            }
        }
    };
        
}]);