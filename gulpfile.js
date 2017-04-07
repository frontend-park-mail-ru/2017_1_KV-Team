/**
 * Created by andreivinogradov on 07.04.17.
 */

const gulp = require('gulp');
const fest = require('fest');
const fs = require('fs');

const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const merge = require('utils-merge');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');


/* nicer browserify errors */
const gutil = require('gulp-util');
const chalk = require('chalk');

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/static/application/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  this.end()
}
/* */

gulp.task('compileTemplates', function () {
  const xmls = fs.readdirSync('./static/templates/src');
  fs.mkdirSync('./static/templates/views');
  xmls.forEach((xml) => {
    if (xml === 'basic.xml') {
      return;
    }
    const fileName = xml.split('.')[0];
    const compiled = fest.compile(`./static/templates/src/${fileName}.xml`, { beautify: false });
    fs.writeFileSync(`./static/templates/views/${fileName}.js`, compiled, 'utf8');
  });
});

// gulp.task('browserify', function () {
//   const bundler = browserify('./static/application/App.js', { debug: true });
//
//   bundler.transform(babelify, { presets: ['es2015'] });
//   bundler.transform('brfs');
//   return bundle_js(bundler);
// });

// Without sourcemaps
gulp.task('browserify-production', function () {
  const bundler = browserify('./static/application/App.js');
  bundler.transform(babelify, { presets: ['es2015'] });
  bundler.transform('brfs');

  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('App.js'))
    .pipe(buffer())
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('static'));
});

// gulp.task('watchify', function () {
//   const args = merge(watchify.args, { debug: true });
//   const bundler = watchify(browserify('./static/application/App.js', args));
//
//   bundler.transform(babelify, { presets: ['es2015'] });
//   bundler.transform('brfs');
//
//   bundle_js(bundler);
//
//   bundler.on('update', function () {
//     bundle_js(bundler);
//   });
// });

// function bundle_js(bundler) {
//   return bundler.bundle()
//     .on('error', map_error)
//     .pipe(source('App.js'))
//     .pipe(buffer())
//     .pipe(gulp.dest('static'))
//     .pipe(rename('app.min.js'))
//     .pipe(sourcemaps.init({ loadMaps: true }))
//     // capture sourcemaps from transforms
//     .pipe(uglify())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('static'));
// }


gulp.task('default', ['compileTemplates', 'browserify-production']);

// // Without watchify
// gulp.task('browserify', function () {
//   const bundler = browserify('./src/js/app.js', { debug: true }).transform(babelify, {/* options */ })
//
//   return bundle_js(bundler)
// })
//
// // Without sourcemaps
// gulp.task('browserify-production', function () {
//   const bundler = browserify('./src/js/app.js').transform(babelify, {/* options */ })
//
//   return bundler.bundle()
//     .on('error', map_error)
//     .pipe(source('app.js'))
//     .pipe(buffer())
//     .pipe(rename('app.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/dist'))
// })