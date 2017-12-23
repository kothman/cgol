'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-glob-import');
var sourceMaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('default', ['watch']);

gulp.task('html', function () {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html:watch', function () {
    gulp.watch('./app/**/*.html', ['html']);
});

gulp.task('sass', function () {
    return gulp.src('./app/scss/main.scss')
        .pipe(sourceMaps.init())
        .pipe(bulkSass())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/scss/**/*.scss', ['sass']);
});

gulp.task('scripts', function() {
    gulp.src('./app/ts/lib/**/*')
	.pipe(sourceMaps.init())
	.pipe(ts({
	    outDir: '/dist/js/',
	    outFile: 'lib.js'
	}))
	.pipe(sourceMaps.write())
	.pipe(gulp.dest('./dist/js/'));
    return gulp.src(['./app/ts/lib/**/*', './app/ts/main.ts'])
        .pipe(sourceMaps.init())
        .pipe(ts({
            outDir: './dist/js/',
            outFile: 'main.js'
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts:watch', function () {
    gulp.watch('./app/ts/**/*', ['scripts']);
});

gulp.task('watch', function () {
    gulp.run(['scripts:watch', 'sass:watch', 'html:watch']);
});

gulp.task('test', function () {
    return gulp.src(['./dist/js/lib.js', './spec/**/*.js'])
	.pipe(jasmineBrowser.specRunner())
	.pipe(jasmineBrowser.server({port: 8888}));
});
