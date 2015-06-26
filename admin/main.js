var app = angular.module("sampleApp", [
	'firebase',
	'checklist-model'
]);

app.constant('FIREBASE_URL', "https://activitats.firebaseio.com/")

app.controller("SampleCtrl", function($scope, ActivitatsService) {
	
	$scope.newActivitat = {
		codi: ActivitatsService.getActivitats().length + 1,
		activitat_destacada: {id: 10, prioritat: "10"},		
		nivell_recomenat: 'Primaria',
		nivelleducatiu: [{ id: 1, nom:"Educació infantil"}],
		area_de_coneixement: { id: 1, nom: "Socials" },
	    foto1: { id: '', peuFoto: "", publicarWeb: true, pathFoto: "fotos-activitats/i1.jpg" },
		titol: 'Títol de la activitat al parc arqueològic de les mines de Gavà', 
		subtitol: 'Això pot ser un subtítol',
		descripcio: 'Hashtag keffiyeh synth street art, fixie Neutra food truck sriracha kogi Odd Future organic disrupt gentrify. Echo Park aesthetic trust fund freegan, cold-pressed mixtape pop-up. Blog disrupt four dollar toast plaid Austin, Echo Park 90\'s vegan art party mlkshk ugh 8-bit. Selvage fashion axe quinoa messenger bag farm-to-table occupy. Photo booth Helvetica pour-over hella XOXO, bitters authentic dreamcatcher food truck DIY banjo twee fap. Actually forage small batch squid, Bushwick dreamcatcher swag. Disrupt Tumblr cliche, selfies street art Schlitz lumbersexual banh mi gastropub cray.',
		durada: '1h 30m',
		preu: '20€',
		lloc: '<a href="https://es.wikipedia.org/wiki/Barcelona" target="_blank">Barcelona</a>',
		info_i_reserves: 'info_i_reserves',
		observacions: 'Hashtag keffiyeh synth street art, fixie Neutra food truck sriracha kogi Odd Future organic disrupt gentrify. Echo Park aesthetic trust fund freegan, cold-pressed mixtape pop-up.',
		material_didactic: 'Material .pdf<br> Material <a href="">link</a><br>Altres materials.',
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

	$scope.nivells_activitat_destacada = [ 
		{id: 1, prioritat: "1"},
		{id: 2, prioritat: "2"},
		{id: 3, prioritat: "3"},
		{id: 4, prioritat: "4"},
		{id: 5, prioritat: "5"},
		{id: 6, prioritat: "6"},
		{id: 7, prioritat: "7"},
		{id: 8, prioritat: "8"},
		{id: 9, prioritat: "9"},
		{id: 10, prioritat: "10"},
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