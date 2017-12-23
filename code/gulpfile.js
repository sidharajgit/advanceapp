var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var flatten = require('gulp-flatten');
var zip = require('gulp-zip');
var sass = require('gulp-sass');
var path = require('path');
var livereload = require('gulp-livereload'); // live reload
var connect = require('gulp-connect'); // 
var opn = require('opn');
var bower = require('bower-files')();
var $ = require('gulp-load-plugins')({
    lazy: true
});
gulp.task('JsFiles', function () {
    return gulp.src(['app/*.js','app/scripts/factory/*.js','app/scripts/controllers/*.js','app/scripts/services/*.js','app/scripts/directives/*.js','app/scritps/JsonFiles/*.js','app/scripts/utilities/*.js'])        
	.pipe(order([
            'app/advancePublishingmodule.js',
            'app/scripts/factory/sFactory.js',
            
        ], { base: './' }))
        .pipe(concat('JsFiles.js'))
        .pipe(gulp.dest('dest/js'))
        .pipe(connect.reload());
});
gulp.task('images', function () {
    return gulp.src(['app/assets/images/*'])
        .pipe(flatten())
        .pipe(gulp.dest('dest/images/')).pipe(connect.reload());
});
gulp.task('audio', function () {
    return gulp.src(['app/assets/audio/*'])
        .pipe(flatten())
        .pipe(gulp.dest('dest/audio/'));
});
gulp.task('angular-concatHTML', function () {
    return gulp.src(['app/templates/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('dest/templates/')).pipe(connect.reload());
});

gulp.task('fontStyle', function () {
    return gulp.src(['app/assets/fonts/*.css'])
        .pipe(concat('fontStyles.css'))
        .pipe(gulp.dest('dest/css/'));
});
gulp.task('sass', function () {
  gulp.src(['app/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('scssStyles.css'))
    .pipe(gulp.dest('dest/css/')).pipe(connect.reload());
});
gulp.task('vendorsass', function () {
  gulp.src(['node_modules/font-awesome/scss/*.scss','app/vendors/sass/*.css','app/vendors/sass/*.scss','app/vendors/sass/components/*.scss','app/vendors/sass/bootstrap/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendorsass.css'))
    .pipe(gulp.dest('dest/css/')).pipe(connect.reload());
});
gulp.task('minifyVendorScripts', function() {
    return gulp.src(['app/vendors/js/*.js'])
        .pipe(order([
                'app/vendors/js/jquery.min.js',
                'app/vendors/js/highcharts.js',
                'app/vendors/js/underscore.min.js',
                /*'app/vendors/js/angular.js',*/
                'app/vendors/js/angular.min.js',
                'app/vendors/js/angular-ui-router.min.js',
                'app/vendors/js/angular-animate.min.js',
                'app/vendors/js/angular-aria.min.js',
                /*'app/vendors/js/angular-message.js',*/
                'app/vendors/js/angular-message.min.js',
                'app/vendors/js/angular-materialize.min.js',
                'app/vendors/js/jplayer.min.js',
                'app/vendors/js/notify.js',
                'app/vendors/js/ui-bootstrap.min.js',
                'app/vendors/js/ui-bootstrap-tpls.min.js',
               // 'node_modules/angular-spinners/dist/angular-spinners.js',
				'app/vendors/js/bootstrap-colorpicker-module.js',
                /*'app/vendors/js/map-loader.js',*/
                'app/vendors/js/moment.min.js',
				'app/vendors/js/angular-moment.min.js',                
                'app/venders/js/no-data-report.js',
                'app/vendors/js/exportChart.js', 
                'app/vendors/js/highmaps.js',                
                'app/vendors/js/angular-daterangepicker.min.js',
                'app/vendors/js/highmaps-world.js'
            ], { base: './' }))
		.pipe(concat('vendor.js'))
        //.pipe($.uglify())
        .pipe(gulp.dest('dest/js/'));
});
gulp.task('customFonts', function() {
  return gulp.src('app/assets/fonts/montserrat/*.woff2')
    .pipe(gulp.dest('dest/fonts'))
});
gulp.task('vendorFonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('dest/fonts'))
})

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  })
});
gulp.task('openbrowser', function(){
    opn('http://localhost:8080', {app:'Chrome'});
})
//gulp.task('watchFiles', ['JsFiles', 'sass','minifyVendorScripts','angular-concatHTML','audio','images','fontStyle','customFonts']);
gulp.task('watch', function() {
    gulp.watch(['app/*.js','app/scripts/factory/*.js','app/scripts/controllers/*.js','app/scripts/services/*.js','app/scripts/directives/*.js','app/scritps/JsonFiles/*.js'], ['JsFiles']);
    gulp.watch('app/templates/*.html', ['angular-concatHTML']);
    gulp.watch('app/css/*.scss',['sass'])
});

gulp.task('watchFiles', ['JsFiles', 'sass','vendorsass' ,'minifyVendorScripts','angular-concatHTML','audio','images','fontStyle','customFonts','vendorFonts', 'watch','openbrowser','connect']);
gulp.task('deploy', ['watchFiles']);
