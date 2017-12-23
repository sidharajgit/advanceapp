advancePubapp.service('cacheFactory', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('super-cache');
 }]);