var myApp = angular.module('myApp', ['todoService']);

myApp.controller("mainController", function($scope, $http, Todos) {

    $scope.input = {};
    $scope.showInfo = {};
    $scope.showInfo[0] = true;
    $scope.sortOptions = ["All", "Active", "Completed"];

    Todos.get()
    .success(function(data) {
        $scope.todos = data;
        $scope.loading = false;
    });

    $scope.createTodo = function() {
        if ($scope.input.text != undefined) {
            $scope.loading = true;

            Todos.create($scope.input)
                .success(function(data) {
                    $scope.loading = false;
                    $scope.input = {}; 
                    $scope.todos = data;
                });
        }
    };

    $scope.completeTodo = function(id, completed) {
        $scope.loading = true;

        Todos.update(id, completed)
            .success(function(data) {
                $scope.loading = false;
                $scope.todos = data; 
            });
    };

    $scope.deleteTodo = function(id) {
        $scope.loading = true;

        Todos.delete(id)
            .success(function(data) {
                $scope.loading = false;
                $scope.todos = data;
            });
    };

    $scope.sort = function(type, index) {
    	if(type == "All") {
    		$scope.completed = "";
    	} else if (type == "Completed") {
    		$scope.completed = true;
    	} else if (type == "Active") {
    		$scope.completed = false;
    	}
    	for(var prop in $scope.showInfo) {
	      $scope.showInfo[prop] = false;
	    }
    	$scope.showInfo[index] = true;
    }
});