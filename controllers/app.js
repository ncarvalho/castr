// set my application to the variable 'app'
var app = angular.module('casting', ['ngRoute', 'firebase', 'appCtrls', 'dcbImgFallback']);
var appCtrls = angular.module('appCtrls', ['firebase']);

// this handles my templates and routes
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/projects/:projectID/chat', {
			templateUrl: 'views/chat.html', 
			controller: 'ChatCtrl'
		}).when('/home', {
			templateUrl: 'views/projects.html', 
			controller: 'ProjectsCtrl'
		}).when('/apply', {
			templateUrl: 'views/apply.html', 
			controller: 'ApplyCtrl'
		}).when('/applicant/:applicantID', {
			templateUrl: 'views/details.html',
			controller: 'ApplicantCtrl'
		}).when('/projects/:projectID', {
			templateUrl: 'views/project.html',
			controller: 'ProjectCtrl'
		}).when('/users/:userID', {
			templateUrl: 'views/projects.html',
			controller: 'MyProjectsCtrl'
		}).when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		}).when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegisterCtrl'
		}).when('/select', {
			templateUrl: 'views/select.html',
			controller: 'SelectCtrl'
		}).when('/thanks', {
			templateUrl: 'views/thanks.html'
		}).when('/', {
			templateUrl: 'views/login.html'
		}).otherwise({ redirectTo: '/' });
}]);
// controller for the director registration
app.controller('RegisterCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/users");

	// set ref to authobj for user authentication    
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
// controller for the Applicant details
app.controller('ApplicantCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID);
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable
	$scope.currentApplicant = $scope.sync.$asObject();
}]);


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
// controller for notes chat (chat in each actor's detail page)
app.controller('NotesCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID + "/notes");
	// start a firebase app with this url 
	var sync = $firebase(ref);
	
	// set ref to authobj for user authentication
	$scope.authObj = $firebaseAuth(ref);
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

	// addmessage function that adds message to array along with its author upon hitting return, then clears the textarea
	$scope.notes = sync.$asArray();
	$scope.addMessage = function(e) {
		$scope.fullName = $scope.currentuser.fname + " " + $scope.currentuser.lname;
		// "if enter button is pressed"
		if(e.keyCode != 13) return;
		$scope.notes.$add({
			from: $scope.fullName,
			text: $scope.newMessage,
			id: $scope.currentuser.$id
		}).then(function(){
			// clears the textarea
			$scope.newMessage = "";
		});
	}
}]);
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
// controller for adding projects
app.controller('ProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	// set ref to authobj for user authentication
    $scope.authObj = $firebaseAuth(ref);
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

    // addProject function that adds projects to array
	$scope.projects = sync.$asArray();
	$scope.addProject = function() {
		// adds project creator along with project info
		$scope.project.user_id = $scope.currentuser.$id;
		$scope.projects.$add(
			$scope.project
		).then(function(ref){
			// clears the form
			$scope.project = {};

			var myProjectsRef = new Firebase("https://casting.firebaseio.com/users/" + $scope.currentuser.$id + "/myprojects");
			var sync = $firebase(myProjectsRef);
			var myprojects = sync.$asArray();
			myprojects.$add({
				id: ref.key()
			});

			console.log("id", ref.key());
		});
	}
}]);
// controller for the Project details
app.controller('ProjectCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/" + $routeParams.projectID);
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	$scope.currentProject = $scope.sync.$asObject();
}]);
// controller for displaying projects in the actor audition application
app.controller('SelectCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/");
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable then console logging the data received from that applicant
	$scope.projects = $scope.sync.$asArray();
}]);
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
