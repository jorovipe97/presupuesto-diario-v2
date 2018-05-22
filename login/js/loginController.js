var app = angular.module('login', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
    .when("/", {
        templateUrl : "login-buttons.html",
        controller: 'loginController'
    })
    .when("/time", {
        templateUrl : "1-time.html",
        controller: 'timeController'
    })
});

app.controller('timeController', function ($scope, $location) {
	$scope.numOfDays = null;

	$scope.setNumOfDays = function (val)
	{
		$scope.numOfDays = val;
	}

	$scope.submitForm = function ()
	{
		if ($scope.numOfDays === null)
		{
			console.log("Debes introducir un numero");
			return;
		}
		console.log('form submited');
	}


})

app.controller('loginController', function ($scope) {

	var userProfile = {};
	//$scope.url = './../app/';
 	$scope.url = '#!time';

	$scope.loginUser = function ()
	{
		userProfile.name = 'Andres Sierra';
		userProfile.isFirstLogin = false;


		// Checks if is the first user login
		if (localStorage.getItem('lsUserProfile') === null)
		{
			userProfile.isFirstLogin = true;
			$scope.url = '#!time';
		}

		// Saves user profile info into the local storage
		var str = JSON.stringify(userProfile);
		localStorage.setItem('lsUserProfile', str);
		console.log(userProfile);
	}


})