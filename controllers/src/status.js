// controller for current user status
app.controller('StatusCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	$rootScope.$on('$firebaseAuth:login', function(e, authUser){
		// console.log users information
		console.log('email: ', authUser);
		$scope.userEmail = authUser.email;
	});

	var userRef = new Firebase("https://casting.firebaseio.com/home");
    $scope.authObj = $firebaseAuth(userRef);

    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
			// console.log to view who is logged in
		    // console.log("Logged in as:", authData.uid);
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    // console.log to view the current users info
		    // console.log("This here ", $scope.currentuser);
	  } else {
	  	// console.log to view if user is logged out
	    console.log("Logged out");
	  }
	});

	// console.log('Current project', $scope.currentProject);
}]);