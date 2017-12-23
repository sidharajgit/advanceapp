advancePubapp.controller('advancepublicationsController',function($scope,$state,$rootScope,$window,sfactory){

    $scope.$on('contenttemplate',function(event,args){
        $scope.contentTemplatename = templateURL+'dest/templates/'+args.contentTemplate+'.html';
    });
    $rootScope.$watch('appLoader',function(newVal,oldVal){
        $scope.appLoaderCheck = $rootScope.appLoader;
    })
    $(window).scroll(function () {
                if ($(window).scrollTop() > 50) {
                    $('.md-sidenav-left').addClass('md-sidenav-left-top');
                }
    });  
    
});
