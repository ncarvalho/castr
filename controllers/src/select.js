// controller for displaying projects in the actor audition application
app.controller('SelectCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/");
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable then console logging the data received from that applicant
	$scope.projects = $scope.sync.$asArray();
}]);