angular.module('todoService', [])
	.factory('Todos', ['$http', function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			update: function (id, completed) {
				return $http.post('/api/todos/' + id + '/' + completed);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	}]);