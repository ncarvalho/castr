// set my application to the variable 'app'
var app = angular.module('casting', ['ngRoute', 'firebase', 'appCtrls', 'dcbImgFallback']);
var appCtrls = angular.module('appCtrls', ['firebase']);

// this handles my templates and routes
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/agenda', {
			templateUrl: 'views/agenda.html', 
			controller: 'AgendaCtrl'
		}).when('/projects/:projectID/chat', {
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
// controller for agenda chat
app.controller('AgendaCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/");
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
	// setting applicant object to a variable then console logging the data received from that applicant
	$scope.currentApplicant = $scope.sync.$asObject();
	console.log('Current Applicant', $scope.currentApplicant);
	console.log('Current project in applicant', $scope.currentProject);

}]);


// controller for current user status
app.controller('StatusCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	$rootScope.$on('$firebaseAuth:login', function(e, authUser){
		// console.log users information
		console.log('email: ', authUser);
		$scope.userEmail = authUser.email;
	});

	var userRef = new Firebase("https://casting.firebaseio.com/home");
    $scope.authObj = $firebaseAuth(userRef);

    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
			// console.log to view who is logged in
		    // console.log("Logged in as:", authData.uid);
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    // console.log to view the current users info
		    // console.log("This here ", $scope.currentuser);
	  } else {
	  	// console.log to view if user is logged out
	    console.log("Logged out");
	  }
	});

	// console.log('Current project', $scope.currentProject);
}]);
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
// controller for chat chat
app.controller('ChatCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/" + $routeParams.projectID + "/chat");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/projects/" + $routeParams.projectID + "/chat");
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

	// addmessage function that adds message to array along with its author upon hitting return, 
	// then clears the textarea
	$scope.messages = sync.$asArray();
	$scope.addMessage = function(e) {
		$scope.fullName = $scope.currentuser.fname + " " + $scope.currentuser.lname;
		
		if(e.keyCode != 13) return;
		$scope.messages.$add({
			from: $scope.fullName,
			text: $scope.newMessage,
			id: $scope.currentuser.$id
		}).then(function(){
			$scope.newMessage = "";
		});
	}
}]);
// controller for chat chat
app.controller('ProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/projects");
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

	$scope.projects = sync.$asArray();
	$scope.addProject = function() {
		
		$scope.project.user_id = $scope.currentuser.$id;
		
		$scope.projects.$add(
			$scope.project
		).then(function(){
			$scope.project = {};
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
	// console.log('Current project', $scope.currentProject);

}]);
// controller for the Project details
app.controller('SelectCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/projects/");
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable then console logging the data received from that applicant
	$scope.projects = $scope.sync.$asArray();
	// console.log($scope.currentProject);

}]);

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
app.controller('MyProjectsCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', '$routeParams', function($scope, $location, $firebase, $firebaseAuth, $rootScope, $routeParams){
	

	var userRef = new Firebase("https://casting.firebaseio.com/users/" + $routeParams.userID + "/myprojects");
    $scope.authObj = $firebaseAuth(userRef);

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
			$location.path('/login');
		}
	});

	$scope.addMyProject = function(e) {
		$scope.myprojects.$add({
			id: $scope.projectsKey
		}).then(function(){
			$scope.projectsKey = "";
		});
	}

}]);

app.filter('projectfilter', function () {
  return function () {
    var projectkeys = [];

    console.log("myprojects", $rootScope.myprojects);

    angular.forEach($rootScope.myprojects, function(value, key) {
	  this.push(value);
	  console.log("value", value);
	}, projectkeys);

    return projectkeys;
  };
});
