angular.module('myApp', ['myMap', 'myChart', 'myTreeMap'])
  .factory('d3', function() {
    return d3;
  })

  .controller('MainController', ['$scope', 'd3',
    function($scope, d3) {

      var dataUrl = '../data/IHME_2013_subset.csv'
      // $scope.selection = {};
      // $scope.data = {};

      d3.csv(dataUrl, function(error, data) {
        console.log('loading data');
        if (error) console.log(error);
        $scope.data = data;
        $scope.selection = data.filter(function(d) {
          return d.sex_id == 3;
        });
        $scope.$digest();
      })

      $scope.subSelect = function(id) {
        console.log('subSelect called with id ' + id);
        $scope.countryData = $scope.data.filter(function(d) {
          return d.location == id;
        });
        $scope.$digest();
      }


    }]);
