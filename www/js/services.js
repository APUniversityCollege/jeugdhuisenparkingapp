angular.module('parkingapp.services', [])

.factory('AddressService', ['$http', '$q', function($http, $q) {
	return {
		getCoordinates: function(address) {
			var q = $q.defer();
			$http.get('http://nominatim.openstreetmap.org/search?q=' + address + '&format=json').
				success(function(data, status, headers, config) {
					q.resolve(data);
				});
			return q.promise;
		},
		getAddress: function(lat, lng) {
			var q = $q.defer();
			$http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1').
			success(function(data, status, headers, config) {
					q.resolve(data);
				});
			return q.promise;
		}
	}
}])

.factory('ZoneService', ['$http', '$q', function($http, $q) {
	return {
		getZones: function() {
			var q = $q.defer();
			$http.get('http://datasets.antwerpen.be/v4/gis/paparkeertariefzones.json').
				success(function(data, status, headers, config) {
					q.resolve(data.data);
				});
			return q.promise;
		}
	}
}])

.factory('YouthCenterService', ['$http', '$q', function($http, $q) {
	return {
		getYouthCenters: function() {
			var q = $q.defer();
			$http.get('http://datasets.antwerpen.be/v4/gis/jeugdhuisoverzicht.json').
				success(function(data, status, headers, config) {
					q.resolve(data.data);
				});
			return q.promise;
		}
	}
}])

.factory('TariffService', function() {
	//["Rood", "Lichtgroen", "Donkergroen", "Geel", "Oranje", "Blauw"]
	var tarieven = [
		{'kleur': 'Rood', 'max': 3, 'start': 9, 'einde': 22, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [1.60, 2.70, 3.80]},
		{'kleur': 'Donkergroen', 'max': 10, 'start': 9, 'einde': 19, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [0.70, 1.10], 'dagticket': 3.80},
		{'kleur': 'Lichtgroen', 'max': 10, 'start': 9, 'einde': 19, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [0.70, 1.10]},
		{'kleur': 'Geel', 'max': 10, 'start': 9, 'einde': 19, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [0.50]},
		{'kleur': 'Oranje', 'max': 10, 'start': 9, 'einde': 19, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [0.50], 'dagticket': 2.70},
		{'kleur': 'Blauw', 'max': 2, 'start': 9, 'einde': 18, 'dagen': [0, 1, 2, 3, 4, 5],
		'tarief': [0]}
	];
	
	return {
		getTariffText: function(zone) {
			var tarief;
			$.each(tarieven, function(key, value) {
				if (zone == value.kleur) {
					tarief = value;
					return false;
				}
			});
			var text = tarief.kleur;
			var now = new Date();
			if ($.inArray(now.getDay(), tarief.dagen)) {
				if (now.getHours() >= tarief.start && now.getHours() < tarief.einde) {
					var duration = tarief.einde - now.getHours();
					var cost = 0;
					if (duration > tarief.max) { duration = tarief.max; }
					for (var i = 0; i < duration; i++) {
						if (i < tarief.tarief.length) {
							cost += tarief.tarief[i];
						}
						else {
							cost += tarief.tarief[tarief.tarief.length-1];
						}
					}
					if (tarief.dagticket < cost) {
						text += '<br/>Neem een dagticket voor maar € ' + tarief.dagticket.toFixed(2);
					}
					else {
						text += '<br/>Maximale parkeerduur: ' + duration;
						text += '<br/>Maximale kostprijs: € ' + cost.toFixed(2);
					}
				}
			}
			return text;
		}
	}
})

.factory('StorageService', ['$window', function($window){
   return{
	  set: function(key, value){
		$window.localStorage[key] = value;
	  },
	  get: function(key, defaultValue){
		return $window.localStorage[key] || defaultValue;
	  },
	  setObject: function(key, value){
		$window.localStorage[key] = JSON.stringify(value);
	  },
	  getObject: function(key){
		return JSON.parse($window.localStorage[key] || '{}');
	  }
   }
}]);