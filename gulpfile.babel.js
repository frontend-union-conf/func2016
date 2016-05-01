'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const development = $.environments.development;
const production = $.environments.production;

const assetsPath = {
  src: 'assets',
  tmp: '.tmp',
  dest: 'build/assets'
};

const stylePath = {
  src: `${assetsPath.src}/styles/**/*.css`,
  tmp: `${assetsPath.tmp}/${assetsPath.src}/styles/`,
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
  tmp: `${assetsPath.tmp}/${assetsPath.src}/scripts/`,
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
  return gulp.src(`${assetsPath.src}/styles/**/*.css`)
    .pipe($.concat('bundle.css'))
    .pipe($.postcss([
      require('postcss-normalize'), // latest normalize.css
      require('postcss-normalize-charset'), // @charset "utf-8"
      require('postcss-cssnext')(), // http://cssnext.io/features/
      require('postcss-inline-svg')({ // inline SVG
        path: svgPath.folder
      }),
      require('postcss-svgo') // optimise inline SVG
    ])).on('error', log)
    .pipe(production($.csso()))
    .pipe(development(gulp.dest(stylePath.tmp)))
    .pipe(production(gulp.dest(stylePath.dest)))
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

gulp.task('html', () => {
  return gulp.src('*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', () => {
  return gulp.src(scriptsPath.src)
    .pipe(development($.sourcemaps.init()))
    //.pipe($.concat('bundle.js'))
    .pipe($.babel())
    .pipe(development($.sourcemaps.write('.')))
    .pipe(production($.uglify()))
    .pipe(development(gulp.dest(scriptsPath.tmp)))
    .pipe(production(gulp.dest(scriptsPath.dest)))
    .pipe(reload({stream: true}));
});

gulp.task("copy", () => {
  gulp.src(fontsPath.src).pipe(gulp.dest(fontsPath.dest));
  gulp.src(imagesPath.src).pipe(gulp.dest(imagesPath.dest));
});

gulp.task('clean', del.bind(null, ['.tmp', 'build']));

gulp.task('serve', ['styles', 'scripts'], () => {
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

gulp.task('set-production', function() {
  return $.environments.current(production);
});

gulp.task('prod', ['styles', 'scripts', 'html', 'images', 'copy'], () => {
  return gulp.src('build/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean', 'set-production'], () => {
  gulp.start('prod');
});
