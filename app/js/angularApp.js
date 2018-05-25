var app = angular.module('presupuestoApp', ['ngRoute']);

app.config(function($routeProvider) {
 	// This is `false` by default
    // $locationProvider.html5Mode(true);

	$routeProvider
	.when('/', {
		templateUrl: './views/app.html',
		controller: 'presupDiarioController'
	})
	.when('/reports', {
		templateUrl: './views/reports.html'
	})
	.when('/outcomes-managment', {
		templateUrl: './views/outcomes.html',
		controller: 'outcomesManagment'
	})
	.when('/incomes-managment', {
		templateUrl: './views/incomes.html',
		controller: 'incomesManagment'
	})
	.when('/about', {
		templateUrl: './views/acerca.html'
	});
});

app.controller('outcomesManagment', function ($scope) {
	// Removes an added income from the list
	$scope.removeIncome = function (index)
	{
		// index, how many
		$scope.userProfile.outcomeList.splice(index, 1);
		// Saves the income list with the removed 
		$scope.saveOutcomeList();
	}

	// Save income list
	$scope.saveOutcomeList = function ()
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.outcomeList = $scope.userProfile.outcomeList;

		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}
});

app.controller('incomesManagment', function ($scope) {
	// Removes an added income from the list
	$scope.removeIncome = function (index)
	{
		// index, how many
		$scope.userProfile.incomeList.splice(index, 1);
		// Saves the income list with the removed 
		$scope.saveIncomeList();
	}

	// Save income list
	$scope.saveIncomeList = function ()
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.incomeList = $scope.userProfile.incomeList;

		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}
});

app.controller('presupDiarioController', function ($scope) {
	$scope.presupuestoDiario = null;
	var data = null;

	var canExecute = true;
	$scope.initPresupuestoCtrl = function ()
	{
		if (!canExecute)
		{
			return;
		}

		// This code section executes once time
		console.log('Executed once baby');

		var canvasCtx = document.getElementById('chart-canvas').getContext('2d');

		data = {
		    datasets: [{
		        data: [10, 20],
		        backgroundColor: [
		        	'rgba(46, 204, 113,1.0)', // flat green
		        	'rgba(231, 76, 60,1.0)' // flat red
		        ]
		    }],

		    // These labels appear in the legend and in the tooltips when hovering different arcs
		    labels: [
		        'Total Disponible',
		        'Total Gastado'
		    ]
		};

		var options = {
			responsive: true,
			legend: {
				position: 'bottom'
			},
			title: {
				display: false,
				text: 'Demo Chart by using chart.js'
			},
			animation: {
				animationScale: true,
				animationRotate: true
			}
		}

		// And for a doughnut chart
		window.myDoughnutChart = new Chart(canvasCtx, {
		    type: 'doughnut',
		    data: data,
		    options: options
		});


		
		$scope.updatePresupuestoDiario();
		canExecute = false;
	}

	$scope.updatePresupuestoDiario = function ()
	{
		// Loads into ram the profile stored in localstorage
		$scope.loadProfile();
		$scope.presupuestoDiario = $scope.getPresupuestoDiario();

		data.datasets[0].data[0] = $scope.getTotalIncome();
		data.datasets[0].data[1] = $scope.getTotalOutcome();

		window.myDoughnutChart.update();
	}

	// This is the core function of this app
	$scope.getPresupuestoDiario = function ()
	{
		var incomes = $scope.getTotalIncome();
		console.log('foo');
		var outcomes = $scope.getTotalOutcome();

		var remainingDays = $scope.userProfile.numOfDays - $scope.daysBetween( $scope.getStartDate(), $scope.getTodaysDate() );

		// Updates remaining days when becomes 0 or negative
		if (remainingDays <= 0)
		{
			// Actualizar la variable startDate
			var newStartDate = $scope.getRemainingDays();
			$scope.setStartDate(newStartDate.toDateString());

			// Recalculates the number of remaining days
			remainingDays = $scope.getRemainingDays()
		}

		/*
		TODO: Si queremos hacer que el presupuesto diario no de valores como 33 pesos
		ya que en colombia el minimo paso que podria seria de 50 pesos, podemos implementar un staircase function.
		
		https://math.stackexchange.com/questions/1671132/equation-for-a-smooth-staircase-function
		*/
		return (incomes - outcomes) / remainingDays;
	}

	$scope.getRemainingDays = function ()
	{
		return $scope.userProfile.numOfDays - $scope.daysBetween( $scope.getStartDate(), $scope.getTodaysDate() );
	}	

	/*Date difference explanation https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript*/
	// Argument format example: 'October 29, 2018'
	var treatAsUTC = function (date) {
	    var result = new Date(date);
	    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	    return result;
	}

	/* 
	If the second argument is not supplied then today's date is used
	*/
	$scope.daysBetween = function (startDate, endDate)
	{
		var millisecondsPerDay = 24 * 60 * 60 * 1000;

		var finalDate = endDate || $scope.getTodaysDate();

    	return (treatAsUTC(finalDate) - treatAsUTC(startDate)) / millisecondsPerDay;
	}

	$scope.getStartDate = function ()
	{
		var str = localStorage.getItem('startDate');
		if (str === null)
		{
			return;
		}

		return str;
	}

	$scope.setStartDate = function (date_str)
	{
		localStorage.setItem('startDate', date_str);
	}

	$scope.getTodaysDate = function ()
	{
		var d = new Date();
		return d.toDateString();
	}

	$scope.addDays = function (date, days) {
	  var result = new Date(date);
	  result.setDate(result.getDate() + days);
	  return result;
	}

	/*
	TODO:
	1. Trabajar en el calculo de ingresos y gastos totales para los nuevos periodos, actualmente
	solo funciona bien para el primer periodo	
	*/
	$scope.removeNonRecurringIncomes = function ()
	{
		// https://blog.mariusschulz.com/2016/07/16/removing-elements-from-javascript-arrays
		var newArr = $scope.userProfile.incomeList.filter( income => income.recurringRevenue);
		console.log(newArr);
	}
})

app.controller('appController', function ($scope) {
	$scope.userProfile = {};
	$scope.navMenus = ['presupuesto', 'reporte', 'gastos', 'ingresos', 'acerca'];
	$scope.activeNav = null;

	$scope.init = function ()
	{
		// Adds clone method to JSON object
		if (typeof JSON.clone !== "function") {
		    JSON.clone = function(obj) {
		        return JSON.parse(JSON.stringify(obj));
		    };
		}

		$scope.activeNav = $scope.navMenus[0];

		$scope.loadProfile();
		console.log($scope.userProfile);
	}

	$scope.logout = function ()
	{
		localStorage.removeItem('lsUserProfile');
		localStorage.removeItem('startDate');
	}

	$scope.setActive = function (index)
	{
		$scope.activeNav = $scope.navMenus[index % $scope.navMenus.length];
	}

	$scope.loadProfile = function ()
	{
		var profile_str = localStorage.getItem('lsUserProfile');
		if (profile_str !== null)
		{
			$scope.userProfile = JSON.parse(profile_str);
		}
	}

	$scope.getTotalIncome = function ()
	{
		var total = 0;
		for (let i = 0; i < $scope.userProfile.incomeList.length; i++)
		{

			total += $scope.userProfile.incomeList[i].ammount;
		}
		return total;
	}

	$scope.getTotalOutcome = function ()
	{
		var total = 0;
		for (let i = 0; i < $scope.userProfile.outcomeList.length; i++)
		{

			total += $scope.userProfile.outcomeList[i].ammount;
		}
		return total;
	}

	/********************************************************
	**** INCOME CONTROLLER **********************************
	*********************************************************
	*/

	$scope.income = {
		name: null,
		ammount: null,
		recurringRevenue: false
	};

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
		// Saves the new income into the local storage
		$scope.saveIncome(incomeCopy);
		console.log($scope.incomeList);
		// Cleans the form
		$scope.income.name = null;
		$scope.income.ammount = null;		
	}

	// Save new income into local storage
	$scope.saveIncome = function (income)
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.incomeList.unshift(income);

		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}


	/********************************************************
	**** OUTCOME CONTROLLER *********************************
	*********************************************************
	*/

	$scope.outcome = {
		name: null,
		ammount: null,
		recurringRevenue: false
	};

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
		// Saves the new OUTCOME into the local storage
		$scope.saveOutcome(outcomeCopy);
		// Cleans the form
		$scope.outcome.name = null;
		$scope.outcome.ammount = null;		
	}

	// Save outcome list
	$scope.saveOutcome = function (outcome)
	{
		var profile = JSON.parse(localStorage.getItem('lsUserProfile'));

		profile.outcomeList.unshift(outcome);
		var profile_str = JSON.stringify(profile);
		localStorage.setItem('lsUserProfile', profile_str);		
	}

});
