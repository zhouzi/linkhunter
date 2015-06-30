angular
    .module('LinkHunter', [])
    .service('LinkHunterService', [
        function () {
            return new LinkHunter();
        }
    ])
    .filter('huntLinky', [
        'LinkHunterService',
        function (LinkHunterService) {
            return function (str, options) {
                if (!angular.isString(str)) return str;

                if (!angular.isObject(options)) options = {};

                return LinkHunterService.linky(str, options);
            }
        }
    ])
;