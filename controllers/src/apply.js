// controller for the audition application
app.controller('ApplyCtrl', ['$scope', '$firebase', '$location', function($scope, $firebase, $location){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications");
	// start a firebase app with this url 
	var sync = $firebase(ref);
	// saving the array of applications to firebase
	$scope.applications = sync.$asArray();
	// apply function that accepts all the fields from the apply.html and saves into applications array
	

	$scope.apply = function(e) {
		$scope.applications.$add(
			$scope.application
		).then(function(){
			// after application is submitted, clear form and navigate to home
			$scope.application = {};
			$scope.applicationForm.$setUntouched();
			$location.path('/thanks');
		});
	}

}]);