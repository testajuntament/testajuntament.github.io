'use strict';

var app = angular.module('app', [
	'ngRoute', 
	'caco.ClientPaginate', 
	'gettext', 
	'angularMoment', 
	'seo',
	'ngSanitize', 
	'mgcrea.ngStrap'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', 
    function($routeProvider, $locationProvider, $httpProvider) {
	//$locationProvider.html5Mode(true);
	//$locationProvider.hashPrefix('!');

	$routeProvider
		.when('/graella-activitats', {
			controller: 'ListCtrl',
			templateUrl: 'templates/graella-activitats.html',			
		})
		.when('/fitxa/:id', {
			controller: 'DetailCtrl',
			templateUrl: 'templates/detail.html',
		})
		.when('/materials-didactics', {
			controller: 'MaterialsCtrl',
			templateUrl: 'templates/materials-didactics.html',
		})		
		.otherwise({
			redirectTo: '/graella-activitats'
		});
}]);

app.run(['$rootScope', '$location', 'Paginator', 'gettextCatalog', 'amMoment', '$timeout', '$window', 
	function($rootScope, $location, Paginator, gettextCatalog, amMoment, $timeout, $window) {
	
	/*$rootScope.userAgent = function(){
		var ua = navigator.userAgent;
        var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
        var isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
        var isFirefox = /firefox/i.test(ua);
		if( isChrome ){ return 'isChrome'; }
		if( isFirefox ){ return 'isFirefox'; }
		if( isiPad ){ return 'isiPad'; }
	};*/

	/* febrero */
		// $rootScope.basePath =  'http://febreroeldocumental.com/testajuntament';  
		// $rootScope.baseGavaPath = 'http://portals.ajuntament.gava.cat'; 
		// $rootScope.pathPhotoDefault = 'http://febreroeldocumental.com/testajuntament/fotos-activitats/LaVenus-color.jpg';

	/* Github */
	$rootScope.basePath =  'http://testajuntament.github.io'; 
	$rootScope.baseGavaPath = 'http://portals.ajuntament.gava.cat'; 
	$rootScope.pathPhotoDefault = 'http://testajuntament.github.io/img/LaVenus-color.jpg';	


	/* Local paths */
	// $rootScope.basePath =  'http://localhost/testajuntament'; 
	// $rootScope.baseGavaPath = 'http://portals.ajuntament.gava.cat';
	// $rootScope.pathPhotoDefault = 'http://localhost/testajuntament/img/LaVenus-color.jpg'; //Per si no es carreguen les fotos.

	/* Production paths */
	//$rootScope.basePath =  'http://portals.ajuntament.gava.cat'; 
	//$rootScope.baseGavaPath = 'http://portals.ajuntament.gava.cat';
	//$rootScope.pathPhotoDefault = 'http://portals.ajuntament.gava.cat/img/LaVenus-color.jpg';

	$rootScope.historyLink = 'graella-activitats';
	$rootScope.bodyClass = 'graella-activitats'; 

	$rootScope.$on('$locationChangeStart', function(event, next, current) { 
		if (next.indexOf('/fitxa/') !== -1 ) {
			if (current.indexOf('graella-activitats') !== -1 ) {
				$rootScope.historyLink = 'graella-activitats';
			} else if (current.indexOf('fitxa') !== -1 ) {
				$rootScope.historyLink = 'fitxa';
			} else if (current.indexOf('materials-didactics') !== -1) {
				$rootScope.historyLink = 'materials-didactics';
		    }
		    $rootScope.bodyClass = 'fitxa';

		}else if (next.indexOf('materials-didactics') !== -1 ){
			if (current.indexOf('graella-activitats') !== -1 ) {
				$rootScope.historyLink = 'graella-activitats';
			} else if (current.indexOf('fitxa') !== -1 ) {
				$rootScope.historyLink = 'fitxa';
			} else if (current.indexOf('materials-didactics') !== -1) {
				$rootScope.historyLink = 'materials-didactics';
		    }
		    $rootScope.bodyClass = 'materials-didactics';
		 }  
	});

	$rootScope.$on('$locationChangeSuccess', function() {
		var text = gettextCatalog.getString('Activitats per a escoles - Museu de Gavà - Ajuntament de Gavà');
		$('html head title').text(text);
		$('html head meta[name=description]').attr("content", text);
	});

	$rootScope.goBack = function() {
		var path;
		if ($rootScope.historyLink === 'graella-activitats'){ 
			path = 'graella-activitats'; 
		}else if ($rootScope.historyLink === 'materials-didactics'){ 
			path = 'materials-didactics';
		}else if ($rootScope.historyLink === 'fitxa') { 
			path =  'fitxa';
		}
		$location.path(path);	
	};

	//For IOS7-8 history issue
	//$window.history.go(-1);
	//$window.scrollTo(0, 0); 

    /*$timeout(function(){ 
      $rootScope.bodyClass = 'graella-activitats';	
	  $location.path(path).replace(); 
	}, 100);*/

	$rootScope.goHome = function(){
        $timeout(function(){ 
          $rootScope.bodyClass = 'graella-activitats';
		  $location.path('graella-activitats');
		},400);
	};

	$rootScope.getGridPath = function() {
		return  '#/graella-activitats';
	};

	$rootScope.getDetailPath = function(id) {
		return  '#/fitxa/' + id;
	};

	$rootScope.getMaterialsPath = function(){
		return  '#/materials-didactics';
	};

	$rootScope.rowsPerPage = 9; 
	$rootScope.searchText = "";
	$rootScope.nivellFilterModels = [];
	$rootScope.areaFilterModels = [];

	var resetPager = function() {
		Paginator.page = 0;
	};

	$rootScope.$watchCollection('nivellFilterModels', resetPager);
	$rootScope.$watchCollection('areaFilterModels', resetPager);
	$rootScope.$watch('rowsPerPage', resetPager);
	$rootScope.$watch('searchText', resetPager);

	$rootScope.activitatsFilter = function(activitat) {
		var acceptar = false;
		var empty = false;
		var allFalse = true;

		angular.forEach($rootScope.nivellFilterModels, function(nivellFilterModel){
			if(nivellFilterModel === true){
				allFalse = false;
			}
		});
		if (allFalse === true){
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
			return activitat.titol.toLowerCase().indexOf($rootScope.searchText.toLowerCase()) !== -1 || activitat.subtitol.toLowerCase().indexOf($rootScope.searchText.toLowerCase()) !== -1;
		}

		return true;
	};

	$rootScope.hexToRgba = function(hex,opacity){
		var r, g, b, result;
	    hex = hex.replace('#','');
	    r = parseInt(hex.substring(0,2), 16);
	    g = parseInt(hex.substring(2,4), 16);
	    b = parseInt(hex.substring(4,6), 16);
	    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
	    return result;
	};

	$rootScope.colorDarken = function(color, percent){
    	var num = parseInt(color.slice(1),16), 
    		amt = Math.round(2.55 * percent), 
    		R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    	
    	return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
	};
}]);

app.controller('ChangeViewCtrl',['$scope', '$location', 
	function($scope,   $location) {
	$scope.$location = $location;
}]);

app.controller('ListCtrl', ['$scope', '$routeParams', '$rootScope', '$timeout', 'GavaAPI', 
	function($scope, $routeParams, $rootScope, $timeout, GavaAPI) {

	GavaAPI.getAllActivitats().then(function(activitats) {
		$scope.activitats = activitats;
	});
}]);

app.controller('MaterialsCtrl', ['$scope', '$routeParams', '$location', '$window', '$rootScope', '$timeout', 'GavaAPI',
    function($scope,   $routeParams,   $location,   $window,   $rootScope,   $timeout,   GavaAPI) {
	
	GavaAPI.getAllActivitats().then(function(activitats) {
		$scope.activitats = activitats;
	});	

	GavaAPI.getAllMaterials().then(function(materials) {
		$scope.materials = materials;
	});

	GavaAPI.getAllCategorias().then(function(categorias) {
		$scope.categorias = categorias;
	});
}]);

app.controller('DetailCtrl', ['$scope', '$routeParams', '$location', '$window', '$rootScope', '$timeout', 'GavaAPI', 'gettextCatalog',  '$sce' ,
    function($scope,   $routeParams,   $location,   $window,   $rootScope,   $timeout ,   GavaAPI,   gettextCatalog,    $sce) {
	
	$window.scrollTo(0, 0);

	$scope.goBack = function() {
		var path;
		if ($rootScope.historyLink === 'graella-activitats'){ 
			path = 'graella-activitats'; 
		}else if ($rootScope.historyLink === 'materials-didactics'){ 
			path = 'materials-didactics';
		}else if ($rootScope.historyLink === 'fitxa') { 
			path =  'fitxa';
		}
		$location.path(path);	
	};

	$scope.print = function() {
		$window.print();
	};

	GavaAPI.getActivitatByCodi($routeParams.id).then(function(activitat) {
		$scope.shareTitle = gettextCatalog.getString('Servei Pedagògic: ') + activitat.titol;
		$scope.shareDescription = activitat[$rootScope.descripcioAttrKey];
		$scope.shareURL = $window.location.href.replace('/#','');
		$scope.activitat = activitat;
		$scope.images = [];
		$('html head title').text($scope.shareTitle);
		$('html head meta[name=description]').attr("content", $scope.shareDescription);
		$scope.htmlReady();
	}, function() {/*console.error('No work');*/} );

	$scope.getDescription = function() {
		if ($scope.activitat) {
			return $sce.trustAsHtml($scope.activitat[$rootScope.descripcioAttrKey]);
		}
	};
}]);

app.controller('FiltersCtrl', ['$scope', 'GavaAPI', 'gettextCatalog', '$rootScope',
	function($scope,   GavaAPI,   gettextCatalog,   $rootScope) {

	GavaAPI.getAllNivells().then(function(allNivells) {
		$scope.allNivells = allNivells;
		if ($rootScope.nivellFilterModels.length === 0) {
			angular.forEach($scope.allNivells, function(nivellsEducatius) {
				$rootScope.nivellFilterModels[nivellsEducatius.id] = false;
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
}]);

/*DIRECTIVES*/
app.directive('magnificpopup', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var	defaults = {};
			var	options	 = angular.extend({}, defaults, scope.$eval(attrs.gallery));

			element.magnificPopup({
				delegate: options.selector,
				closeMarkup:'<button title="Tancar imatge" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>',
				// gallery: {
				// 	enabled: true,
				// 	navigateByImgClick: true,
				// 	preload: [0, 1]
				// },
				image: {
					verticalFit: false,
					tError: 'Error: No es pot carregar la imatge.',
					titleSrc: function (item) {
						return item.el.attr('title');
					}
				},
				tLoading: 'Loading...',
				type: 'image',
				closeOnContentClick: true,
			});
		}
	};
});

app.directive('matchheight', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind("load", function(e) {
				//$('.matchcol').matchHeight();//.modul-obra
			});
			element.bind("resize", function(e) {
				//$('.matchcol').matchHeight();
			});
		}
	};
});

app.directive('viewTitle', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var text = element.text();
			element.remove();
			$('html head title').text(text);
		}
	};
});

app.directive('viewDescription', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var text = element.text();
			element.remove();
			$('html head meta[name=description]').attr("content", text);
		}
	};
});

/*SERVICES*/
app.service('GavaAPI', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
	var allActivitats;
	var allAreas; 
	var allNivells;
	var defer;
	var allMaterials;
	var allCategorias;

	var getAllActivitats = function() {
		if (defer) {
			return defer.promise;
		}
		defer = $q.defer();
		if (allActivitats) {
			defer.resolve(allActivitats);
		} else {
			//$http({
			//	url: 'http://portals.ajuntament.gava.cat/WS-RESTActivitatsMuseu/webresources/org.gava.model.activitat'
			//})
			//$http.get('http://portals.ajuntament.gava.cat/WS-RESTActivitatsMuseu/webresources/org.gava.model.activitat?callback=JSON_CALLBACK')
			$http.get('activitats.json')
			.success(function(response) {
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

	var getColorByCategoriaNom = function(categoriaNom){
		categoriaNom = categoriaNom;
		var nomPicked;

		var defer = $q.defer();
		this.getAllActivitats().then(function(activitats) {
			angular.forEach(activitats, function(activitat){
				nomPicked = activitat.areaConeixement.nom;
				if (categoriaNom === nomPicked){
					defer.resolve(activitat.areaConeixement.color);
					return;
				}
			});
			defer.reject();
		});
		return defer.promise;	
	};

	var getAllMaterials = function(){

		var defer = $q.defer();
		this.getAllActivitats().then(function(activitats) {
			allMaterials = [];
			
			angular.forEach(activitats, function(activitat){
				angular.forEach(activitat.materialDidactics, function(material){
					allMaterials.push(material);
				});
			});
			defer.resolve(allMaterials);
		});
		return defer.promise;		
	};

	var getAllCategorias = function(){
		var defer = $q.defer();
		if (allCategorias) {
			defer.resolve(allCategorias);
		} else {
			this.getAllMaterials().then(function(materials) {
				allCategorias = {};
				angular.forEach(materials, function(material) {
					allCategorias[material.categoriaMaterialDidactic.id] = material.categoriaMaterialDidactic;					
				});				
				defer.resolve(allCategorias);
			});
		}			
		return defer.promise;
	};		

	var getActivitatByCodi = function(id) {
		var number = parseInt(id, 10);
		var activitatId;
		var defer = $q.defer();
		this.getAllActivitats().then(function(activitats) {
			angular.forEach(activitats, function(activitat){
				activitatId = parseInt(activitat.id, 10);
				if (activitatId === number){
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
					
					if( angular.isArray(activitat.nivellsEducatius) ){
						angular.forEach(activitat.nivellsEducatius, function(nivellEducatiu){
							allNivells[nivellEducatiu.id] = nivellEducatiu;
						});
					}
					//else{
						//angular.forEach(activitat.nivellsEducatius, function(value, key){
						//	allNivells[activitat.nivellsEducatius.id] = key + ': ' + value;
						//	console.log('nivellEducatiu si es objeto', value)
						//});						
						    //allNivells[activitat.nivellsEducatius.key] = nivellEducatiu; 
						//angular.forEach(activitat.nivellsEducatius, function(value, key) {
						  //allNivells.push(key + ': ' + value);
						//});     
					//}
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
		'getAllAreas': getAllAreas,
		'getAllMaterials': getAllMaterials,
		'getAllCategorias': getAllCategorias,
		'getColorByCategoriaNom' : getColorByCategoriaNom
	};
}]);

/*FILTERS*/
app.filter('unique', function () {
  return function ( collection, keyname) {
      var output = [];
      var keys = [];
      var found = [];

      if (!keyname) {

          angular.forEach(collection, function (row) {
              var is_found = false;
              angular.forEach(found, function (foundRow) {

                  if (foundRow == row) {
                      is_found = true;                            
                  }
              });

              if (is_found) { return; }
              found.push(row);
              output.push(row);

          });
      }
      else {

          angular.forEach(collection, function (row) {
              var item = row[keyname];
              if (item === null || item === undefined) return;
              if (keys.indexOf(item) === -1) {
                  keys.push(item);
                  output.push(row);
              }
          });
      }

      return output;
  };
});

app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });