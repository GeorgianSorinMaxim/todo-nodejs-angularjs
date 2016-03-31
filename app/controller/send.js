var myApp = angular.module("myApp", []);

myApp.controller("registerController", function($scope, $http) {

    $scope.typeOptions = [
        { name: 'All', value: '0' },
        { name: 'Motorola One X - Don', value: '1' },
        { name: 'iPhone 5s - John', value: '2' }
    ];

    $scope.receiver = $scope.typeOptions[0].value;

});
