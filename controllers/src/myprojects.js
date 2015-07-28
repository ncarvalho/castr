app.controller('MyProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	

	var userRef = new Firebase("https://casting.firebaseio.com/users/" + $routeParams.userID + "/myprojects");
    $scope.authObj = $firebaseAuth(userRef);

    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    $scope.currentuser.$loaded().then(function(data){
		    	$scope.currentuser = data;
		    	console.log("user", $scope.currentuser);
		    	var ref = new Firebase("https://casting.firebaseio.com/users/" + $scope.currentuser.$id + "/myprojects");
				var sync = $firebase(ref);
				$rootScope.myprojects = sync.$asArray();
		    })
		} else {
			$location.path('/login');
		}
	});

	$scope.addMyProject = function(e) {
		$scope.myprojects.$add({
			id: $scope.projectsKey
		}).then(function(){
			$scope.projectsKey = "";
		});
	}

}]);

app.filter('projectfilter', function () {
  return function () {
    var projectkeys = [];

    console.log("myprojects", $rootScope.myprojects);

    angular.forEach($rootScope.myprojects, function(value, key) {
	  this.push(value);
	  console.log("value", value);
	}, projectkeys);

    return projectkeys;
  };
});
