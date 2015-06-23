var app = angular.module("sampleApp", [
	'firebase',
	'checklist-model'
]);

app.constant('FIREBASE_URL', "https://activitats.firebaseio.com/")

app.controller("SampleCtrl", function($scope, ActivitatsService) {
	
	$scope.newActivitat = {
		codi: "",
		activitat_destacada: false,		
		nivell_recomenat: 'Primaria',
		nivelleducatiu: [],
		area_de_coneixement: { id: '', nom: ''},
	    foto1: { id: '', peuFoto: "", publicarWeb: true, pathFoto: "fotos-activitats/i1.jpg" },
		titol: 'Això és el títol', 
		subtitol: 'Això pot ser un subtítol',
		descripcio: '',
		durada: '1h 30m',
		preu: '20€',
		lloc: 'Barcelona',
		info_i_reserves: 'info_i_reserves',
		observacions: 'observacions',
		material_didactic: 'material_didactic',
		tallers:[
			{   
				id:'1', 
				titol: 'taller figures egipcies', 
				descripcio: 'lorem lorem lorem lorem lorem lorem lorem', 
				nivell_recomenat: 'primaria', 
				imatge: 'fotos-tallers/taller-1.jpg'
			},
			{   
				id:'2', 
				titol: 'taller figures antigues', 
				descripcio: 'lorem lorem lorem lorem lorem lorem lorem', 
				nivell_recomenat: 'primaria', 
				imatge: 'fotos-tallers/taller-2.jpg'
			},
			{   
				id:'3', 
				titol: 'taller figures', 
				descripcio: 'lorem lorem lorem lorem lorem lorem lorem', 
				nivell_recomenat: 'primaria', 
				imatge: 'fotos-tallers/taller-3.jpg'
			}						
		]
	};

	$scope.newTaller = 	{   
		id:'', 
		titol: 'taller figures egipcies', 
		descripcio: 'lorem lorem lorem lorem lorem lorem lorem', 
		nivell_recomenat: 'primaria', 
		imatge: 'fotos-tallers/taller-1.jpg'
	};

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

	$scope.tallers = function(id){
		var tallers = {};
		ActivitatsService.getTallers();
		return tallers
	}

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

app.factory('ActivitatsService',["$firebaseArray", "FIREBASE_URL", function( $firebaseArray, FIREBASE_URL){
	var ref = new Firebase(FIREBASE_URL);
	var activitats = $firebaseArray(ref);
	var tallers = $firebaseArray(ref.child('tallers'));

	var getActivitats = function(){
		return activitats;
	};

	var getTallers = function(id){
		tallers = ref.child('id').child('tallers');
		console.log('tallers: ' + tallers);
		return tallers;
	};

	var addActivitat = function(activitat){
		activitats.$add(activitat);
	};

	var addTaller = function(taller){
		console.log('tallers: ' + tallers);
		activitats.$add(taller);
	};

	var updateActivitat = function(id){
		activitats.$save(id);
	};

	var updateTaller = function(id){
		tallers.$save(id);
	};

	var removeActivitat = function(id){
		activitats.$remove(id);
	};

	var removeTaller = function(id){
		tallers.$remove(id);
	};

	return {
		getActivitats: getActivitats,
		getTallers: getTallers,

		addActivitat: addActivitat,
		addTaller: addTaller,

		updateActivitat: updateActivitat,
		updateTaller: updateTaller,

		removeActivitat: removeActivitat,
		removeTaller: removeTaller
	}
}]);