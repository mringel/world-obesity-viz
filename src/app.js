angular.module('myApp', ['myMap'])

  .controller('MainController', ['$scope',
    function($scope) {

      $scope.selection = {};
      $scope.data = {};

    }]);
