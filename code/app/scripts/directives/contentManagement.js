advancePubapp.directive('contentManagement', function () {
    return {
        restrict: 'E',
        templateUrl: typeof(siteURL) == "undefined" ? 'dest/templates/classcontentManagement.html' :'dest/templates/classcontentManagement.html',
        controller:'classcontentmanagementController',
        scope: {
            tabname: "=",
            headerdata: '=',
            activetab : "="
        },
        link:function(scope, elem, attrs) {
        }
    };
});