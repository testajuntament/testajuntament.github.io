"use strict"; 

var app = angular.module('app', ['ngRoute', 'caco.ClientPaginate', 'gettext', 'angularMoment', 'seo','ngSanitize']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	//$locationProvider.html5Mode(true);
	//$locationProvider.hashPrefix('!');
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$routeProvider
		.when('/llista-activitats', {
			controller: 'ListCtrl',
			templateUrl: 'templates/llista-activitats.html',
		})
		.when('/graella', {
			controller: 'ListCtrl',
			templateUrl: 'templates/grid.html',
		})
		.when('/graella-activitats', {
			controller: 'ListCtrl',
			templateUrl: 'templates/graella-activitats.html',			
		})
		.when('/fitxa/:id', {
			controller: 'DetailCtrl',
			templateUrl: 'templates/detail.html',
		})
		.otherwise({
			redirectTo: '/graella-activitats'
		});
}]);

app.run(function($rootScope, $location, Paginator, gettextCatalog, amMoment) {
	gettextCatalog.debug = false; 
	$rootScope.basePath =  'http://testajuntament.github.io/';  
	// $rootScope.basePath =  'http://localhost/testajuntament/';  
	$rootScope.historyLink = 'graella';

	$rootScope.changeLanguage = function(language) {
		var path = $location.path(),
			newPath;
		if ($rootScope.language === 'ca') {
			if (path.indexOf('llista') !== -1) {
				newPath = '/es/lista';
			} else if (path.indexOf('graella') !== -1) {
				newPath = '/es/parrilla';
			} else if (path.indexOf('mapa') !== -1) {
				newPath = '/es/mapa';
			} else if (path.indexOf('fitxa') !== -1) {
				newPath = path.replace('ca/fitxa', 'es/ficha');
			}
		} else {
			if (path.indexOf('lista') !== -1) {
				newPath = '/llista';
			} else if (path.indexOf('parrilla') !== -1) {
				newPath = '/graella-activitats';
			} else if (path.indexOf('mapa') !== -1) {
				newPath = '/ca/mapa';
			} else if (path.indexOf('ficha') !== -1) {
				newPath = path.replace('es/ficha', 'ca/fitxa');
			}
		}
		$rootScope.language = language;
		$location.path(newPath);
	};
	$rootScope.$watch('language', function() {
		amMoment.changeLanguage($rootScope.language);
		gettextCatalog.setCurrentLanguage($rootScope.language);
		$rootScope.titolAttrKey = gettextCatalog.getString('titolCatala');
		$rootScope.peuFotoAttrKey = gettextCatalog.getString('peuFoto');
		$rootScope.descripcioAttrKey = gettextCatalog.getString('descripcioCatala');
		$rootScope.filterTopicAttrKey = gettextCatalog.getString('nomCatala');

		$rootScope.filterNivellAttrKey = 'nom';
		$rootScope.filterAreaAttrKey = 'nom';
	});

	$rootScope.$on('$locationChangeStart', function(event, next, current) {
		if (next.indexOf('/mapa') !== -1) {
			$rootScope.bodyClass = 'home-mapa';
		} else if (next.indexOf('/fitxa/') !== -1 || next.indexOf('/ficha/') !== -1) {
			if (current.indexOf('llista') !== -1 || current.indexOf('lista') !== -1) {
				$rootScope.historyLink = 'llista';
			} else if (current.indexOf('graella') !== -1 || current.indexOf('parrilla') !== -1) {
				$rootScope.historyLink = 'graella';
			}
			$rootScope.bodyClass = 'fitxa';
		} else {
			$rootScope.bodyClass = '';
		}

		if (next.indexOf('/') !== -1) {
			$rootScope.language = 'ca';
		} else if (next.indexOf('/es/') !== -1) {
			$rootScope.language = 'es';
		}
	});

	// $rootScope.$on('$locationChangeSuccess', function() {
	// 	var text = gettextCatalog.getString('Activitats per a escoles - Museu de Gavà - Ajuntament de Gavà');
	// 	$('html head title').text(text);
	// 	$('html head meta[name=description]').attr("content", text);
	// 	ga('send', 'pageview', {
	// 		page: $location.url()
	// 	});
	// });

	$rootScope.getGridPath = function() {
		return ($rootScope.language === 'ca') ? '#/graella-activitats' : '#/es/parrilla-actividades';
	};

	$rootScope.getListPath = function() {
		return ($rootScope.language === 'ca') ? '#/llista-activitats' : '#/es/lista-actividades';
	};

	$rootScope.getDetailPath = function(id) {
		return  '#/fitxa/' + id;
	};

	$rootScope.rowsPerPage = 9;
	$rootScope.searchText = "";

	$rootScope.nivellFilterModels = [];
	$rootScope.areaFilterModels = [];
	$rootScope.nivellFilterModels[1] = false;
	$rootScope.nivellFilterModels[2] = false;
	$rootScope.nivellFilterModels[3] = false;
	$rootScope.nivellFilterModels[4] = false;
	$rootScope.nivellFilterModels[5] = false;

	var resetPager = function() {
		Paginator.page = 0;
	};

	$rootScope.$watchCollection('nivellFilterModels', resetPager, true);
	$rootScope.$watchCollection('areaFilterModels', resetPager, true);
	$rootScope.$watch('[rowsPerPage,searchText]', resetPager);

	$rootScope.activitatsFilter = function(activitat) {
		var acceptar = false;
		var empty = false;

		if( $rootScope.nivellFilterModels[1] === false && $rootScope.nivellFilterModels[2] === false && $rootScope.nivellFilterModels[3] === false && $rootScope.nivellFilterModels[4] === false && $rootScope.nivellFilterModels[5] === false){
			empty = true;
		}

		angular.forEach(activitat.nivellsEducatius, function(nivellsEducatius){
			if ($rootScope.nivellFilterModels[nivellsEducatius.id] === true) {
				acceptar = true;
			}
		});

		if (acceptar === false && empty === false){
			return false;
		}

		if ($rootScope.areaFilterModels[activitat.areaConeixement.id] === false) {
			return false;
		}

		if ($rootScope.searchText) {
			return activitat.titol.toLowerCase().indexOf($rootScope.searchText.toLowerCase()) !== -1 || activitat.titol.toLowerCase().indexOf($rootScope.searchText.toLowerCase()) !== -1;
		}

		return true;
	};
});

app.controller('ChangeViewCtrl', function($scope, $location) {
	$scope.$location = $location;
});

app.controller('ListCtrl', function($scope, $routeParams, $rootScope, $timeout, GavaAPI) {
	GavaAPI.getAllActivitats().then(function(activitats) {
		$scope.activitats = activitats;

		$timeout(function() {
			$scope.htmlReady();
		}, 4000);
	});
});

app.controller('FiltersCtrl', function($scope, GavaAPI, gettextCatalog, $rootScope) {

	GavaAPI.getAllNivells().then(function(allNivells) {
		$scope.allNivells = allNivells;
		if ($rootScope.nivellFilterModels.length === 0) {
			angular.forEach($scope.allNivells, function(nivellsEducatius) {
				$rootScope.nivellFilterModels[nivellsEducatius.id] = true;
			});
		}
	});	

	GavaAPI.getAllAreas().then(function(allAreas) {
		$scope.allAreas = allAreas;
		if ($rootScope.areaFilterModels.length === 0) {
			angular.forEach($scope.allAreas, function(areaConeixement) {
				$rootScope.areaFilterModels[areaConeixement.id] = true;
			});
		}
	});	

});

app.controller('DetailCtrl', function($scope, $routeParams, $location, $window, GavaAPI, gettextCatalog, $rootScope, $sce) {
	$window.scrollTo(0, 0);

	$scope.print = function() {
		$window.print();
	};

	var addFotosFromNode = function(node) {
		if (node.foto1) {
			$scope.images.push(node.foto1);
		}
		if (node.foto2) {
			$scope.images.push(node.foto2);
		}
	};
	console.log('$routeParams.id!!: '+ $routeParams.id);

	GavaAPI.getActivitatByCodi($routeParams.id).then(function(activitat) {
			console.log('activitat: '+activitat);
			console.table(activitat);
		
			$scope.shareTitle = gettextCatalog.getString('Patrimoni Cultural i Natural de Gavà: ') + activitat[$rootScope.titolAttrKey];
			$scope.shareDescription = activitat[$rootScope.descripcioAttrKey];
			$scope.shareURL = $window.location.href.replace('/#','');
			$scope.activitat = activitat;
			$scope.images = [];
			addFotosFromNode($scope.activitat);

			$('html head title').text($scope.shareTitle);
			$('html head meta[name=description]').attr("content", $scope.shareDescription);

			// $rootScope.ogTitle = $scope.shareTitle;
			// $rootScope.ogUrl = $scope.shareURL;
			// $rootScope.ogDescription = $scope.shareDescription;
			// $rootScope.ogImage = $rootScope.basePath + $scope.images[0].pathFoto;

			$scope.htmlReady();
	}, function() {
		//console.error('No work');
	});

	$scope.goBack = function() {
		var path;
		if ($rootScope.historyLink === 'graella') {
			path = ($rootScope.language === 'ca') ? 'ca/graella' : 'es/parrilla';
		} else if ($rootScope.historyLink === 'llista') {
			path = ($rootScope.language === 'ca') ? 'ca/llista' : 'es/lista';
		} else if ($rootScope.historyLink === 'mapa') {
			path = ($rootScope.language === 'ca') ? 'ca/mapa' : 'es/mapa';
		}
		$location.path(path);
	};

	$scope.getDescription = function() {
		if ($scope.activitat) {
			return $sce.trustAsHtml($scope.activitat[$rootScope.descripcioAttrKey]);
		}
	};
});


app.directive('matchheight', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind("load", function(e) {
				$('.modul-obra').matchHeight();
			});
		}
	};
});

app.directive('viewTitle', function() {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var text = element.text();
			element.remove();
			$('html head title').text(text);
		}
	};
});

app.directive('viewDescription', function() {
	return {
		restrict: 'E',
		link: function(scope, element) {
			var text = element.text();
			element.remove();
			$('html head meta[name=description]').attr("content", text);
		}
	};
});

app.service('GavaAPI', function($http, $q, $rootScope) {
	var allActivitats;
	var allAreas; 
	var allNivells;
	var defer;

	var getAllActivitats = function() {
		if (defer) {
			return defer.promise;
		}
		defer = $q.defer();
		if (allActivitats) {
			defer.resolve(allActivitats);
		} else {
			// url: 'https://activitats.firebaseio.com/.json' ?callback=JSON_CALLBACK
			// url: 'activitats.json'
			// url: 'http://portals.ajuntament.gava.cat/WS-RESTActivitatsMuseu/webresources/org.gava.model.activitat'
			$http({
				'http://portals.ajuntament.gava.cat/WS-RESTActivitatsMuseu/webresources/org.gava.model.activitat'
				// url: 'http://localhost/testajuntament/activitats.json'
			}).success(function(response) {
				allActivitats = [];
				angular.forEach(response, function(activitat) {
					allActivitats.push(activitat);
				});
				$rootScope.allActivitats = allActivitats;
				defer.resolve(allActivitats);
			}).error(function() {
				defer.reject();
			});
		}
		return defer.promise;
	};

	var getActivitatByCodi = function(id) {
		var number = parseInt(id, 10);
		var defer = $q.defer();
		this.getAllActivitats().then(function(activitats) {
			angular.forEach(activitats, function(activitat){
				if (activitat.id === number){
					defer.resolve(activitat);
					return;
				}
			});
			defer.reject();
		});
		return defer.promise;
	};


	var getAllNivells = function() {
		var defer = $q.defer();
		if (allNivells) {
			defer.resolve(allNivells);
		} else {	
			this.getAllActivitats().then(function(activitats) {
				allNivells = {};
				angular.forEach(activitats, function(activitat) {
					angular.forEach(activitat.nivellsEducatius, function(nivellsEducatius){
						allNivells[nivellsEducatius.id] = nivellsEducatius;
					});	
				});
				defer.resolve(allNivells);
			});
		}

		return defer.promise;

	};	

	var getAllAreas = function() {
		var defer = $q.defer();
		if (allAreas) {
			defer.resolve(allAreas);
		} else {
			this.getAllActivitats().then(function(activitats) {

				allAreas = {};
				angular.forEach(activitats, function(activitat) {
					allAreas[activitat.areaConeixement.id] = activitat.areaConeixement;					
				});				
				defer.resolve(allAreas);
			});

		}
		return defer.promise;
	};	
	return {
		'getAllActivitats': getAllActivitats,
		'getActivitatByCodi': getActivitatByCodi,
		'getAllNivells': getAllNivells,
		'getAllAreas': getAllAreas
	};
});