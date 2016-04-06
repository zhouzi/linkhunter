angular
  .module('linkhunter', [])
  .factory('linkhunter', [
    function () {
      return linkhunter;
    }
  ])
  .filter('linkhunterLinky', [
    'linkhunter',
    function (linkhunter) {
      return function (str, options) {
        if (!angular.isString(str)) return str;

        if (!angular.isObject(options)) options = {};

        return linkhunter.linky(str, options);
      }
    }
  ])
;
