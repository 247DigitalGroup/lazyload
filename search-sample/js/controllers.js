var canhApp = angular.module('canhApp', []);

canhApp.controller('FeedController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

	$scope.query = '';
	$scope.result = [];
	$scope.currentItem = {
		html: ''
	};
  
	$scope.search = function() {
		$scope.result = [];
		var url = 'articles.json?q=' + $scope.query;
		$http.get(url)
			.success(function(data, status, headers, config) {
				$scope.result = data
			})
			.error(function(data, status, headers, config) { });
	}

	$scope.cancelCurrent = function() {
		var length = $scope.result.length;
		for (var i = 0; i < length; i ++) {
			$scope.result[i].isCurrent = false;
		}
	}

	$scope.setCurrent = function(item) {
		$scope.cancelCurrent();
		item.isCurrent = true;
		$scope.currentItem = item;
		$scope.currentItem.html = $sce.trustAsHtml('');
	}

}])