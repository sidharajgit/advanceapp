advancePubapp.controller('messageNotificationController',['$scope','notificationdata','$mdToast', function($scope,notificationdata, $mdToast){
    //Method for assign data to scope
    $scope.messagenotification = notificationdata;
    //Method for show more notifications
    $scope.showmorenotification = function(){
        $scope.showmorenotification = 'showmorenotification';
        $mdToast.hide($scope.showmorenotification);
    }
    
    //Method for single click image notification
    $scope.singlemailnotification = function(notificationdata){
        $scope.notificationdata = notificationdata;
        $mdToast.hide($scope.notificationdata.messageId);
    }
}]);