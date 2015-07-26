
app.controller('CategoryCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID + "/category");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID + "/category");
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


	$scope.category = sync.$asArray();

	$scope.categorize = function(e) {
		$scope.category.$save({
			category: $scope.category
		}).then(function(){
			console.log("category: ", $scope.category);
		});
	}
}]);