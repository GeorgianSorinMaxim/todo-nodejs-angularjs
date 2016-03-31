var myApp = angular.module("myApp", []);

myApp.controller("resultsController", function($scope, $http, $q) {

    $scope.patients = JSON.parse('<%= patient %>') %>;
    console.log($scope.patients);

    $scope.triageOptions = [
        { name: 'BLue', value: '0' },
        { name: 'Red', value: '1' },
        { name: 'Green', value: '2' }
    ];

    $scope.triage = $scope.triageOptions[0].value;
});
