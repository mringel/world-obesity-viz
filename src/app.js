angular.module('myApp', ['myMap'])
  .factory('d3', function() {
    return d3;
  })

  .controller('MainController', ['$scope', 'd3',
    function($scope, d3) {

      var dataUrl = '../data/IHME_2013_AG_38_BOTH.csv'
      // $scope.selection = {};
      // $scope.data = {};

      d3.csv(dataUrl, function(error, data) {
        console.log('loading data');
        if (error) console.log(error);
        $scope.data = data;
        $scope.selection = data;
        $scope.$digest();
      })

    }]);
