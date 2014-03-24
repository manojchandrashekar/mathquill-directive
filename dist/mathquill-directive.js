var module = angular.module('mathquill', []);

module.directive('mathquill', ['$interval', function ($interval) {
    return {
        restrict: 'E',
        template: '<span class="mathquill-editable"></span>',
        replace: true,
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var mathquill = element.mathquill('editable');

            var latexWatcher = $interval(function() {
                ngModel.$setViewValue(mathquill.mathquill('latex'));
            }, 500);

            scope.$on('$destroy', function() {
                $interval.cancel(latexWatcher);
            });

            ngModel.$render = function() {
                mathquill.mathquill('latex', ngModel.$viewValue || '');
            };
        }
    }
}]);