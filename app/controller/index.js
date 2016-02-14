var myApp = angular.module("myApp", ['geolocation','ui.bootstrap']);

myApp.controller("indexController", function($scope, $http, $modal, geolocation) {
    // $http.get('/bookings').
    //     success(function(data, status, headers, config) {
    //       $scope.bookings = data;
    //       console.log($scope.bookings);
    //     }).
    //     error(function(data, status, headers, config) {
    //     });

    // $http.post('/bookings', {"serviceprovider": "569686a404230f171346159f", "name" : "abc"} );

    $scope.typeOptions = [
        { name: 'All', value: '0' },
        { name: 'Hair', value: '1' },
        { name: 'Barber', value: '2' },
        { name: 'Nails', value: '3' },
        { name: 'Depilation', value: '4' },
        { name: 'Face Treatment', value: '5' },
        { name: 'Body Care', value: '6' },
        { name: 'Spa & Sauna', value: '7' },
        { name: 'Massage', value: '8' },
        { name: 'Other', value: '9' },
    ];

    $scope.serviceType = $scope.typeOptions[0].value;

    $scope.user = {
       user: 'name',
       password: null
     };

     if (navigator.geolocation) navigator.geolocation.getCurrentPosition(onPositionUpdate);

     function onPositionUpdate(position) {
         var lat = position.coords.latitude;
         var lng = position.coords.longitude;
         var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
         $http.get(url)
             .then(function(result) {
                 var address = result.data.results[2].formatted_address;
                 var city = result.data.results[2].address_components[2].long_name;
                //  console.log(city);
                 $scope.address = city;
             });
     }
});
