// controller for chat chat
app.controller('ProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/projects");
    $scope.authObj = $firebaseAuth(userRef);

    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    $scope.currentuser.$loaded().then(function(data){
		    	$scope.currentuser = data;
		    })
		    
	  } else {
	  	$location.path('/login');
	  }
	});

	$scope.projects = sync.$asArray();
	$scope.addProject = function() {
		
		$scope.project.user_id = $scope.currentuser.$id;
		
		$scope.projects.$add(
			$scope.project
		).then(function(){
			$scope.project = {};
		});
	}

}]);