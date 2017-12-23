advancePubapp.controller('assetPopupController',['$scope','sfactory','$stateParams','$filter','$rootScope', '$mdDialog','$timeout','cacheService','encryptionService','sessionService', '$state','dataToPass', function($scope,sfactory,$stateParams,$filter,$rootScope,$mdDialog,$timeout,cacheService,encryptionService,sessionService, $state,dataToPass){ 

function navigationButton(){
    //Make prev button disabled
    $scope.prev = ($scope.index == 0) ? true : false;
    //Make next button disabled
    $scope.next = ($scope.index == ($scope.datavalues.length - 1)) ? true : false;
    //to load the song
    audio = angular.element(document.getElementById("audiopopup"));
    audio.src = $scope.assetUrl;
    audio.load();
}
$scope.prevSong = function(){
    if($scope.index > 0){
        $scope.index = $scope.index - 1;
        $scope.assetUrl = $scope.datavalues[$scope.index].book_url;
    } 
    
    navigationButton();
};
$scope.nextSong = function(){
    if(($scope.datavalues.length - 1) > $scope.index){
        $scope.index = $scope.index + 1;
        $scope.assetUrl = $scope.datavalues[$scope.index].book_url;        
    }
    
    navigationButton();
};
    
$scope.cancelModel = function(){
    $mdDialog.cancel();
}
function initializeController() {        
    $scope.index = dataToPass.index;
    $scope.assetType = dataToPass.type;
    $scope.datavalues = dataToPass.data;
    $scope.assetUrl = dataToPass.data[$scope.index].book_url;
    navigationButton();
};
    initializeController();
    
    
}]);
    
advancePubapp.filter('assetValid', ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);