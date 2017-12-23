advancePubapp.controller('userSentMailViewController',['$scope','sfactory','$mdDialog','mailcontent',function($scope,sfactory,$mdDialog,mailcontent){ 
    
	$scope.mailcontent = mailcontent;
	
	$scope.sentmailcancel = function(){
		$mdDialog.cancel();
	}
}]);