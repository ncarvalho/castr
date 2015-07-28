// controller for current user status
app.controller('StatusCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// set current user email to variable of userEmail
	$rootScope.$on('$firebaseAuth:login', function(e, authUser){
		$scope.userEmail = authUser.email;
	});

	var userRef = new Firebase("https://casting.firebaseio.com/home");

	// set ref to authobj for user authentication
    $scope.authObj = $firebaseAuth(userRef);
    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
	  } else {
	  	// logged out
	  }
	});
}]);