'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const assetsPath = {
  src: 'assets',
  dest: 'build/assets'
};

const stylePath = {
  src: `${assetsPath.src}/styles/**/*.css`,
  tmp: `.tmp/${assetsPath.src}/styles/`,
  dest: `${assetsPath.dest}/styles/`
};

const imagesPath = {
  src: `${assetsPath.src}/images/**/*.{png,jpg,gif,svg}`,
  dest: `${assetsPath.dest}/images/`
};

const fontsPath = {
  src: `${assetsPath.src}/fonts/**/*.{woff,woff2}`,
  dest: `${assetsPath.dest}/fonts/`
};

const svgPath = {
  src: `${assetsPath.src}/svg/**/*.svg`,
  folder: `${assetsPath.dest}/svg/`
};

const scriptsPath = {
  src: `${assetsPath.src}/scripts/**.js`,
  dest: `${assetsPath.dest}/scripts/`
};

function log() {
  var args = [].slice.call(arguments);
  $.notify.onError({
    title: 'Compile Error',
    message: '<%= error %>'
  }).apply(this, args);
  this.emit('end');
};

gulp.task('styles', () => {
  return gulp.src(stylePath.src)
    .pipe($.concat('bundle.css'))
    .pipe($.postcss([
      require('postcss-normalize'), // latest normalize.css
      require('postcss-normalize-charset'), // @charset "utf-8"
      require('postcss-cssnext')(),
      /*
      require('postcss-mixins'),
      require('postcss-nested'),
      require('postcss-custom-properties')
      */
      require('postcss-inline-svg')({ // inline SVG
        path: svgPath.folder
      }),
      require('postcss-svgo') // optimise inline SVG
    ])).on('error', log)
    .pipe(gulp.dest(stylePath.tmp))
    .pipe(reload({stream: true}));
});

gulp.task("styles-linter", () => {
  return gulp.src(stylePath.src)
    .pipe($.stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('images', () => {
  return gulp.src(imagesPath.src)
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function(err) {
      console.log(err);
      this.end();
    }))
    .pipe(gulp.dest(imagesPath.dest));
});

gulp.task("copy", () => {
  gulp.src("*.html").pipe(gulp.dest("build"));
  gulp.src(fontsPath.src).pipe(gulp.dest(fontsPath.dest));
  gulp.src(imagesPath.src).pipe(gulp.dest(imagesPath.dest));
  gulp.src(scriptsPath.src).pipe(gulp.dest(scriptsPath.dest));
});

gulp.task('clean', del.bind(null, ['.tmp', 'build']));

gulp.task('serve', ['styles'], () => {
  browserSync({
    server: [".tmp", "."],
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch(stylePath.src, ['styles-linter', 'styles']);
  gulp.watch(svgPath.src, ['styles']);
  gulp.watch("*.html").on('change', reload);
});

gulp.task('build', ['images', 'copy'], () => {
  return gulp.src('build/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
