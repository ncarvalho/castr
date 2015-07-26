// controller for the Project details
app.controller('ProjectCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/" + $routeParams.projectID);
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	$scope.currentProject = $scope.sync.$asObject();
	// console.log('Current project', $scope.currentProject);

}]);