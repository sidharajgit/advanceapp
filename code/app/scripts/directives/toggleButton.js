advancePubapp.directive('toggleButton', function() {
    return {
        require: 'ngModel',
        scope: {
            levelOne: '@levelOne',
            levelTwo: '@levelTwo',
            levelSelected: '=ngModel'
        },
        replace: true,
        transclude: true,
        template: '<div>' +
            '<span ng-transclude></span> ' +
            '<button class="btn" ng-class="{\'btn-primary\': state.value}" ng-click="state.toggle()">{{levelOne}}</button>' +
            '<button class="btn" ng-class="{\'btn-primary\': !state.value}" ng-click="state.toggle()">{{levelTwo}}</button>' +
            '</div>',
        link: function postLink(scope) {
            scope.levelSelected = scope.levelOne;
            scope.state = {
                value: true,
                toggle: function() {
                    this.value = !this.value;
                    scope.levelSelected = this.value ? scope.levelOne : scope.levelTwo;
                }
            };
        }
    }
})