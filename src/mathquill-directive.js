var module = angular.module('mathquill', []);

module.directive('mathquill', ['$interval', '$timeout', function ($interval, $timeout) {
    return {
        restrict: 'E',
        scope: {
            //readonly: '=ngReadonly'
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
                    // TODO: Problem found after upgrading to angular 1.6:
                    //      scope.latex = '1^2+1_1=\\frac{12}{23}\\times\\ne\\equiv\\binom{1}{2}';
                    // works as expected. Originally
                    //      scope.latex = clone.html();
                    // hack workaround:
                    scope.latex = clone[0].textContent;
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

            element.bind("keydown", function (event) {
                if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                    scope.$emit('mathquillSave');
                }
            });

            /**
             * focus on mathquill element
             */
            scope.focus = function () {
                mathquill.find("textarea").focus();
            };
        }
    };
}]);
