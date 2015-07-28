// controller for the Applicant details
app.controller('ApplicantCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID);
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable
	$scope.currentApplicant = $scope.sync.$asObject();
}]);

