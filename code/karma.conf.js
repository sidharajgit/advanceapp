// Karma configuration
// Generated on Thu Aug 17 2017 17:33:45 GMT+0530 (India Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
		'app/vendors/js/jquery.min.js',
		'app/vendors/js/highcharts.js',
		'app/vendors/js/underscore-min.js',
		'app/vendors/js/angular.min.js',
		'app/vendors/js/angular-mocks.js',
		'app/vendors/js/angular-ui-router.min.js',
		'app/vendors/js/angular-animate.min.js',
		'app/vendors/js/angular-aria.min.js',
		'app/vendors/js/angular-message.min.js',
		'app/vendors/js/angular-materialize.min.js',
		'app/vendors/js/jplayer.min.js',
		'app/vendors/js/notify.js',
		'app/vendors/js/ui-bootstrap.min.js',
		'app/vendors/js/ui-bootstrap-tpls.min.js',
		'app/vendors/js/bootstrap-colorpicker-module.js',
		'app/vendors/js/moment.min.js',                
		'app/venders/js/no-data-report.js',
		'app/vendors/js/exportChart.js', 
		'app/vendors/js/highmaps.js',                
		'app/vendors/js/angular-daterangepicker.min.js',
		'app/vendors/js/highmaps-world.js',
		
		'app/advancePublishingmodule.js',                
		'app/loader.js',
		'app/scripts/utilities/*.js',
		'app/scripts/services/*.js',
		'app/scripts/directives/*.js',
		'app/scripts/factory/*.js',
		'app/scripts/controllers/*.js',
		
		//Replace your test file here
        'karma-tests/forumController_test.js'
    ],
	
    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors : {
		'app/scripts/**/*.js': 'coverage'
	},

	reporters: ['coverage','spec'],
	
	specReporter: {
        maxLogLines: 5,             // limit number of lines logged per test 
        suppressErrorSummary: true, // do not print error summary 
        suppressFailed: false,      // do not print information about failed tests 
        suppressPassed: false,      // do not print information about passed tests 
        suppressSkipped: true,      // do not print information about skipped tests 
        showSpecTiming: false,      // print the time elapsed for each spec 
        failFast: true              // test would finish with error when a first fail occurs.  
    },

	coverageReporter : {
		  type : 'html',
		  dir : 'coverage/'
	},
    // web server port
    port: 9876,

	plugins: ['karma-spec-reporter','karma-coverage','karma-jasmine','karma-chrome-launcher'],

    // enable / disable colors in the output (reporters and logs)
    colors: true,
	
	browserConsoleLogOptions: {
		terminal: true,
		level: ""
	},

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
