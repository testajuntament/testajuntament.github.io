var app = angular.module("sampleApp", [
	'firebase',
	'checklist-model'
]);

app.constant('FIREBASE_URL', "https://activitats.firebaseio.com/")

app.controller("SampleCtrl", function($scope, ActivitatsService) {
	
	$scope.newActivitat = {
		codi: "1",
		activitat_destacada: false,		
		nivell_recomenat: '',
		nivelleducatiu: [],
		area_de_coneixement: { id: '', nom: ''},
	    foto1: { id: '', peuFoto: "", publicarWeb: true, pathFoto: "fotos-activitats/i1.jpg" },
		titol: 'Això és el títol', 
		subtitol: 'Això pot ser un subtítol',
		descripcio: '',
		durada: '1h 30m',
		preu: '20€',
		lloc: 'Barcelona',
		info_i_reserves: '',
		observacions: '',
		material_didactic: '',
		tallers:[
			{ id:'', titlol: '', descripcio: '', nivell_recomenat: '', imatge: ''}
		]
	};

	$scope.newTaller = {
		id:'', 
		titlol: '', 
		descripcio: '', 
		nivell_recomenat: '', 
		imatge: ''
	}

	//$scope.currentActivitat = null;

	$scope.totsnivells = [
		{ id: 1, nom:"Educació infantil"},
		{ id: 2, nom:"Educació primària"},
		{ id: 3, nom:"ESO"},
		{ id: 4, nom:"Batxillerat"},
		{ id: 5, nom:"Altres"}
	];

	$scope.totesarees = [
		{ id: 1, nom: "Socials" },
		{ id: 2, nom: "Naturals" },
		{ id: 3, nom: "Treball de síntesi" }
	];	


	$scope.activitats = ActivitatsService.getActivitats();
	$scope.tallers = ActivitatsService.getTallers();

	$scope.addActivitat = function(activitat){
		ActivitatsService.addActivitat(angular.copy($scope.newActivitat));
		$scope.newActivitat = {titol: '', subtitol: ''};
	};

	$scope.addTaller = function(taller){
		ActivitatsService.addTaller(angular.copy($scope.newTaller));
		$scope.newTaller = { id:'', titlol: '', descripcio: '', nivell_recomenat: '', imatge: ''};		
	};

	$scope.updateActivitat = function(id){
		ActivitatsService.updateActivitat(id);
	};

	$scope.removeActivitat = function(id){
		ActivitatsService.removeActivitat(id);
	};

});

app.factory('ActivitatsService',["$firebaseArray", "FIREBASE_URL", function($firebaseArray, FIREBASE_URL){
	var ref = new Firebase(FIREBASE_URL);
	var activitats = $firebaseArray(ref);
	var tallers = {};

	var getActivitats = function(){
		return activitats;
	};

	var getTallers = function(id){
		return tallers;
	};

	var addActivitat = function(activitat){
		activitats.$add(activitat)
	};

	var addTaller = function(id, taller){
		tallers.$add(taller)
	};

	var updateActivitat = function(id){
		activitats.$save(id);
	};

	var removeActivitat =function(id){
		activitats.$remove(id);
	};

	return {
		getActivitats: getActivitats,
		getTallers: getTallers,
		addActivitat: addActivitat,
		addTaller: addTaller,
		updateActivitat: updateActivitat,
		removeActivitat: removeActivitat
	}
}]);