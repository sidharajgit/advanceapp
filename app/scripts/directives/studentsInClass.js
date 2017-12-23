advancePubapp.directive('studentsInClass', function () {
    return {
        restrict: 'E',
        templateUrl: typeof(siteURL) == "undefined" ? 'dest/templates/studentsInClass.html' :'dest/templates/studentsInClass.html',
        controller: 'studentsInClassController',
        scope: {
            studentsList: '=',
            parentPagetitle:'@',
            assigncontentToClassPage :'&'
        },
        link:function(scope, element, attributes){
           // console.log(scope.parentPagetitle);
        }
    };
});