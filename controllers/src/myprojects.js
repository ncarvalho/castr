// controller for adding projects to a directors list of projects / join project
app.controller('MyProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/users/" + $routeParams.userID + "/myprojects");
    
	// set ref to authobj for user authentication
    $scope.authObj = $firebaseAuth(ref);
    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    $scope.currentuser.$loaded().then(function(data){
		    	$scope.currentuser = data;
		    	console.log("user", $scope.currentuser);
		    	var ref = new Firebase("https://casting.firebaseio.com/users/" + $scope.currentuser.$id + "/myprojects");
				var sync = $firebase(ref);
				$rootScope.myprojects = sync.$asArray();
		    })
		} else {
			// send to login page if not logged in
			$location.path('/login');
		}
	});

    // adds project keys to directors' array of projects
	$scope.addMyProject = function(e) {
		$scope.myprojects.$add({
			id: $scope.projectsKey
		}).then(function(){
			// clears the textarea
			$scope.projectsKey = "";
		});
	}

}]);


// filter function for filtering through projects (still in development)
app.filter('projectfilter', function () {
  return function (allProjects, myprojects) {
    var userProjects = [];
    if(allProjects && myprojects)
    {
    	angular.forEach(myprojects, function(projectKey) {
    		angular.forEach(allProjects, function(project)
    		{
    			if(projectKey.id === project.$id) 
				 {
				 	userProjects.push(project)
				 }
    		})
			 
		});
    }
    return userProjects;
  };
});
