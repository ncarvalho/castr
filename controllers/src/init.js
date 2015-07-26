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