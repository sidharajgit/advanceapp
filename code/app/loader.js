var loaderApp = angular.module('loader', [
	'bsLoadingOverlay',
	'ui.bootstrap'
]).run(function(bsLoadingOverlayService) {
	bsLoadingOverlayService.setGlobalConfig({
		templateUrl: 'loading-overlay-template.html'
	});
});