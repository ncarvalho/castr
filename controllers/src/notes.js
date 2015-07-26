// controller for home chat
app.controller('NotesCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID + "/notes");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID + "/notes");
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

	// addmessage function that adds message to array along with its author upon hitting return, then clears the textarea
	$scope.notes = sync.$asArray();
	console.log('notes ', $scope.notes);
	$scope.addMessage = function(e) {
		$scope.fullName = $scope.currentuser.fname + " " + $scope.currentuser.lname;
		if(e.keyCode != 13) return;
		$scope.notes.$add({
			from: $scope.fullName,
			text: $scope.newMessage,
			id: $scope.currentuser.$id
		}).then(function(){
			$scope.newMessage = "";
		});
	}
}]);