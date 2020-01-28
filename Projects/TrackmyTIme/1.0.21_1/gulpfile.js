"use strict";

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var removeHtmlComments = require('gulp-remove-html-comments');
var del = require('del');

gulp.task('del', function () {
  return del(['build/**/*']);
});

gulp.task('copy', function () {
  return gulp.src(['*.png', 'manifest.json']).pipe(gulp.dest('build/'));
});

gulp.task('copy-minify-html', function() {
  return gulp.src('./extension.html')
    .pipe(removeHtmlComments())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-minify-pages_helpers', function() {
  return gulp.src('pages_helpers/*')
    .pipe(removeHtmlComments())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/pages_helpers/'));
});

gulp.task('copy-minify-views-html', function() {
  return gulp.src('views/*.html')
    .pipe(removeHtmlComments())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/views/'));
});

gulp.task('copy-minify-js', function() {
  return gulp.src(['extension.js', 'core.js', 'extension-prepare-page.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-minify-models-js', function() {
  return gulp.src(['models/*/*.js', 'models/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/models/'));
});

gulp.task('copy-css', function() {
  return gulp.src(['css/*.css',])
    .pipe(gulp.dest('build/css/'));
});

gulp.task('copy-img', function() {
  return gulp.src(['img/*.*',])
    .pipe(gulp.dest('build/img/'));
});

gulp.task('copy-libs', function() {
  return gulp.src(['libs/**/*']).pipe(gulp.dest('build/libs'));
});

gulp.task('default',   gulp.parallel(
  'copy',
  'copy-css',
  'copy-img',
  'copy-minify-html',
  'copy-minify-pages_helpers',
  'copy-minify-views-html',
  'copy-minify-js',
  'copy-minify-models-js',
  'copy-libs'
));
