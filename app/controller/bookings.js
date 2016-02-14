var myApp = angular.module("myApp", []);

myApp.controller("bookingsController", function($scope, $http) {
    $scope.results = JSON.stringify(bookings);
    // $scope.gender = JSON.stringify(user.local.profile.gender);

    console.log($scope.results);
    console.log(moment($scope.results[0].created).format('DD-MM-YYYY'));
});
