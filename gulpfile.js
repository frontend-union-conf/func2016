var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var postcss    = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('less', function () {
  return gulp.src('./assets/styles/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe( sourcemaps.init() )
    .pipe( postcss([ require('autoprefixer') ]) )
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest('./assets/styles/css'));
});

gulp.task('default', function() {
  // place code for your default task here
});