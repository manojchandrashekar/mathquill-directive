var module = angular.module('mathquill', []);

module.directive('mathquill', ['$interval', '$timeout', function ($interval, $timeout) {
    return {
        restrict: 'E',
        scope: {
            readonly: '=ngReadonly'
        },
        template: '<span ng-class="{\'mathquill-editable\' : !!!readonly}"></span>',
        replace: true,
        require: '?ngModel',
        transclude: true,
        link: function (scope, element, attrs, ngModel, transclude) {
            var mathquill = !!scope.readonly || !ngModel ? element.mathquill() : element.mathquill('editable');
            if (_.isEmpty(ngModel)) {
                scope.readonly = true;

                transclude(scope, function(clone, scope) {
                    scope.latex = clone.html();
                });

                mathquill.mathquill('latex', scope.latex);
            } else {
                var latexWatcher = $interval(function () {
                    ngModel.$setViewValue(mathquill.mathquill('latex'));
                }, 500);

                scope.$on('$destroy', function () {
                    $interval.cancel(latexWatcher);
                });

                ngModel.$render = function () {
                    mathquill.mathquill('latex', ngModel.$viewValue || '');
                };

                $timeout(function () {
                    scope.focus();
                }, 300);

                /**
                 * mathquillCmd broadcast handler
                 */
                var listener = scope.$on('mathquill.command', function (event, command) {
                    if (!!scope.readonly) {
                        return;
                    }
                    mathquill.mathquill('cmd', command);
                    scope.focus();
                });
            }

            /**
             * focus on mathquill element
             */
            scope.focus = function () {
                mathquill.find("textarea").focus();
            };
        }
    };
}]);
