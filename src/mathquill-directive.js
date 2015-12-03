var module = angular.module('mathquill', []);

module.directive('mathquill', ['$interval', '$timeout', function ($interval, $timeout) {
    return {
        restrict: 'E',
        scope: {
            readonly: '=readonly'
        },
        template: '<span ng-class="{\'mathquill-editable\' : !!!readonly}"></span>',
        replace: true,
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var mathquill = !!scope.readonly ? element.mathquill() : element.mathquill('editable');

            var latexWatcher = $interval(function() {
                ngModel.$setViewValue(mathquill.mathquill('latex'));
            }, 500);

            scope.$on('$destroy', function() {
                $interval.cancel(latexWatcher);
            });

            ngModel.$render = function() {
                mathquill.mathquill('latex', ngModel.$viewValue || '');
            };

            $timeout(function() {
                mathquill.find("textarea").focus();

            }, 200);

        }
    };
}]);
