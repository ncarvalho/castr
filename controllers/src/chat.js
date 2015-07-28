// controller for main chat
app.controller('ChatCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/" + $routeParams.projectID + "/chat");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	// set ref to authobj for user authentication
    $scope.authObj = $firebaseAuth(ref);
    // upon authentication log in, if not authenticated, return to login
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

	// addmessage function that adds message to array along with its author upon hitting return
	$scope.messages = sync.$asArray();
	$scope.addMessage = function(e) {
		$scope.fullName = $scope.currentuser.fname + " " + $scope.currentuser.lname;
		// "if enter button is pressed"
		if(e.keyCode != 13) return;
		$scope.messages.$add({
			from: $scope.fullName,
			text: $scope.newMessage,
			id: $scope.currentuser.$id
		}).then(function(){
			// clears the textarea
			$scope.newMessage = "";
		});
	}
}]);