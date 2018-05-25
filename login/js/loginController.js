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
    .when('/incomes', {
    	templateUrl: '2-incomes.html',
    	controller: 'incomesController'
    })
    .when('/outcomes', {
    	templateUrl: '3-outcomes.html',
    	controller: 'outcomesController'
    })
});

app.controller('outcomesController', function ($scope) {
	$scope.outcome = {
		name: null,
		ammount: null,
		recurringRevenue: true
	};

	$scope.outcomeList = [
		/*
		Demo Incomes
		{
			name: 'Transporte',
			ammount: 2000000,
			recurringRevenue: true // El ingreso es recurrente
		},
		{
			name: 'Ventas de assets',
			ammount: 200000,
			recurringRevenue: false // El ingreso es recurrente
		}*/
	];

	$scope.url = '';

	var canLoad = true;
	$scope.init = function ()
	{
		// Ensures the function body is called once
		if (canLoad)
		{
			// Adds clone function to JSON object
			if (typeof JSON.clone !== "function") {
			    JSON.clone = function(obj) {
			        return JSON.parse(JSON.stringify(obj));
			    };
			}			
		
			// Loads the saved income list
			$scope.loadOutcomeList();
			canLoad = false;
		}
	}

	// Adds a new income to the list
	$scope.addOutcome = function ()
	{
		// validates the income form
		if ($scope.outcome.name === null || $scope.outcome.ammount === null)
		{
			console.log("Must fill all the required field");
			return;
		}

		var outcomeCopy = JSON.clone($scope.outcome);
		console.log(outcomeCopy);
		// Adds new elements to the beggining of the incomeList array
		$scope.outcomeList.unshift(outcomeCopy);
		// Saves the new income list into the local storage
		$scope.saveOutcomeList();
		console.log($scope.outcomeList);
		// Cleans the form
		$scope.outcome.name = null;
		$scope.outcome.ammount = null;		
	}

	$scope.loadOutcomeList = function ()
	{
		var profile_str = localStorage.getItem('lsUserProfile');
		
		if (profile_str !== null)
		{
			var profile = JSON.parse(profile_str);

			if (profile.outcomeList === null || typeof profile.outcomeList === 'undefined')
			{
				$scope.outcomeList = [];
			}
			else
			{
				$scope.outcomeList = profile.outcomeList;
			}
		}
	}

	// Removes an added income from the list
	$scope.removeOutcome = function (index)
	{
		// index, how many
		$scope.outcomeList.splice(index, 1);
		// Saves the income list with the removed 
		$scope.saveOutcomeList();
	}

	// Save income list
	$scope.saveOutcomeList = function ()
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.outcomeList = $scope.outcomeList;
		console.log(profile);
		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}

	var saveActualDate = function ()
	{
		var today = new Date();

		localStorage.setItem('startDate', today.toDateString());

	}

	$scope.submitForm = function ()
	{
		if ( $scope.outcomeList.length > 0 )
		{

			$scope.url = "./../app/";
			// Save today's date into the local storage
			saveActualDate();
		}
		else
		{
			$scope.url = "";
		}
	}
});

app.controller('incomesController', function ($scope) {
	$scope.income = {
		name: null,
		ammount: null,
		recurringRevenue: true
	};

	$scope.incomeList = [
		/*
		Demo Incomes
		{
			name: 'Salario',
			ammount: 2000000,
			recurringRevenue: true // El ingreso es recurrente
		},
		{
			name: 'Ventas de assets',
			ammount: 200000,
			recurringRevenue: false // El ingreso es recurrente
		}*/
	];

	$scope.url = '';

	var canLoad = true;
	$scope.init = function ()
	{
		// Ensures the function body is called once
		if (canLoad)
		{
			// Adds clone function to JSON object
			if (typeof JSON.clone !== "function") {
			    JSON.clone = function(obj) {
			        return JSON.parse(JSON.stringify(obj));
			    };
			}
		
			// Loads the saved income list
			$scope.loadIncomeList();
			canLoad = false;
		}		
	}

	// Adds a new income to the list
	$scope.addIncome = function ()
	{
		// validates the income form
		if ($scope.income.name === null || $scope.income.ammount === null)
		{
			console.log("Must fill all the required field");
			return;
		}


		var incomeCopy = JSON.clone($scope.income);
		console.log(incomeCopy);
		// Adds new elements to the beggining of the incomeList array
		$scope.incomeList.unshift(incomeCopy);
		// Saves the new income list into the local storage
		$scope.saveIncomeList();
		console.log($scope.incomeList);
		// Cleans the form
		$scope.income.name = null;
		$scope.income.ammount = null;		
	}

	// Removes an added income from the list
	$scope.removeIncome = function (index)
	{
		// index, how many
		$scope.incomeList.splice(index, 1);
		// Saves the income list with the removed 
		$scope.saveIncomeList();
	}


	// Save income list
	$scope.saveIncomeList = function ()
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.incomeList = $scope.incomeList;

		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}

	$scope.loadIncomeList = function ()
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));
		$scope.incomeList = profile.incomeList;
	}

	$scope.submitForm = function ()
	{
		if ( $scope.incomeList.length > 0 )
		{
			$scope.url = "#!outcomes"
		}
	}

});

app.controller('timeController', function ($scope, $location) {
	$scope.numOfDays = null;
	$scope.url = "";

	$scope.userProfile = {};

	$scope.setNumOfDays = function (val)
	{
		$scope.numOfDays = val;
	}

	$scope.submitForm = function ()
	{
		if ($scope.numOfDays === null || $scope.numOfDays <= 0)
		{
			console.log("Debes introducir un numero valido");
			return;
		}

		$scope.loadProfile();

		$scope.userProfile.numOfDays = $scope.numOfDays;
		var str = JSON.stringify($scope.userProfile);
		localStorage.setItem('lsUserProfile', str);

		$scope.url = "#!incomes";
		console.log('form submited');
	}

	$scope.loadProfile = function ()
	{
		var profile_str = localStorage.getItem('lsUserProfile');
		
		if (profile_str !== null)
		{
			var obj = JSON.parse(profile_str);
			$scope.userProfile = obj;

			if (obj.incomeList === null || typeof obj.incomeList === 'undefined')
			{
				$scope.userProfile.incomeList = [];		
			}	
		}
	}

})

app.controller('loginController', function ($scope) {
	$scope.userProfile = {
		incomeList: []
	};
	$scope.url = './../app/';
 	//$scope.url = '#!time';

	$scope.loginUser = function ()
	{
		$scope.userProfile.name = 'Andres Sierra';
		$scope.userProfile.isFirstLogin = false;


		// Checks if is the first user login
		if (localStorage.getItem('lsUserProfile') === null)
		{
			$scope.userProfile.isFirstLogin = true;
			$scope.url = '#!time';
			$scope.saveUserProfile();
		}
		

		
		// Loads the saved income list
		$scope.loadIncomeList();
		//$scope.userProfile.incomeList = [];

		

		console.log($scope.userProfile);
	}

	$scope.saveUserProfile = function ()
	{
		// Saves user profile info into the local storage
		var str = JSON.stringify($scope.userProfile);
		localStorage.setItem('lsUserProfile', str);
	}

	$scope.loadIncomeList = function ()
	{
		var profile_str = localStorage.getItem('lsUserProfile');
		
		if (profile_str !== null)
		{
			var obj = JSON.parse(profile_str);
			if (obj.incomeList !== null || typeof obj.incomeList !== 'undefined')
			{
				$scope.userProfile.incomeList = obj.incomeList;		
			}	
		}		
	}

})