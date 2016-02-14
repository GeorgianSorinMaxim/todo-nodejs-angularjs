var myApp = angular.module("myApp", []);

myApp.controller("resultsController", function($scope, $http) {

    $scope.results = JSON.stringify(serviceproviders);
    console.log($scope.results);

});
