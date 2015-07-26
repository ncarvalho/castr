// controller for the director registration
app.controller('RegisterCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/users");
    
    $scope.authObj = $firebaseAuth(ref);
	$scope.sync = $firebase(ref);
	$scope.newUser = $scope.sync.$asObject();
	// register function to create a user based on sign up info
	$scope.register = function(){
		$scope.authObj.$createUser({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(){
			// return the data user has sent
			return $scope.authObj.$authWithPassword({
				email: $scope.user.email,
				password: $scope.user.password
			});
		}).then(function(authData){
			// set authData to a variable that can be seen across all controllers
			$rootScope.authData = authData;
			// console log the authData
			console.log('data', authData);
			// the the id and user info to the db and navigate home
			$scope.sync.$set(authData.uid, $scope.user);

			$rootScope.director = authData;
			$location.path('/home');
		}).catch(function(error) {
			// console.log the error for troubleshooting
			console.log(error);
			$scope.authError = error.message;
			$location.path('/register');
		});
	}
	// login function to authenticate users trying to log in
	$scope.login = function(){
		$scope.authObj.$authWithPassword({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(authData) {
			$rootScope.director = authData;
			$location.path('/home');
		}).catch(function(error) {
			// console.log the error for troubleshooting
			console.log(error);
			$scope.authError = error.message;
			$location.path('/login');
		});
	}

}]);