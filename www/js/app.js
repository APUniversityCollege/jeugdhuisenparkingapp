angular.module('parkingapp', ['ionic', 'parkingapp.services', 'parkingapp.controllers', 'leaflet-directive'])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	})
	.state('tab.map-index', {
		url: '/map',
		views: {
			'map-tab': {
				templateUrl: 'templates/map-index.html',
				controller: 'MapController'
			}
		}
	})
	.state('tab.search', {
		url: '/search',
			views: {
			'search-tab': {
				templateUrl: 'templates/search.html',
				controller: 'SearchController'
			}
		}
	})
	.state('tab.data', {
		url: '/data',
			views: {
			'data-tab': {
				templateUrl: 'templates/data.html',
				controller: 'DataController'
			}
		}
	});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');
});
