// controller for adding projects
app.controller('ProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	// set ref to authobj for user authentication
    $scope.authObj = $firebaseAuth(ref);
    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    $scope.currentuser.$loaded().then(function(data){
		    	$scope.currentuser = data;
		    })
		    
	  } else {
	  	// send to login page if not logged in
	  	$location.path('/login');
	  }
	});

    // addProject function that adds projects to array
	$scope.projects = sync.$asArray();
	$scope.addProject = function() {
		// adds project creator along with project info
		$scope.project.user_id = $scope.currentuser.$id;
		$scope.projects.$add(
			$scope.project
		).then(function(ref){
			// clears the form
			$scope.project = {};

			var myProjectsRef = new Firebase("https://casting.firebaseio.com/users/" + $scope.currentuser.$id + "/myprojects");
			var sync = $firebase(myProjectsRef);
			var myprojects = sync.$asArray();
			myprojects.$add({
				id: ref.key()
			});

			console.log("id", ref.key());
		});
	}
}]);