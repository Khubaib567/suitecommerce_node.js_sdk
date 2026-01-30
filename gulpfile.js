const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const path = require('path');

const SUITEAPP_ID = 'com.netsuite.testing';

const paths = {
  src: `src/suiteapps/${SUITEAPP_ID}/**/*`,
  dist: `dist/FileCabinet/SuiteApps/${SUITEAPP_ID}`
};

/**
 * Clean previous deployment
 */
gulp.task('clean:suiteapp', () => {
  return gulp.src(paths.dist, { allowEmpty: true, read: false })
    .pipe(clean());
});

/**
 * Copy SuiteApp files into FileCabinet structure
 */
gulp.task('deploy:suiteapp', () => {
  return gulp.src(paths.src)
    .pipe(gulp.dest(paths.dist));
});

/**
 * Watch changes (local dev)
 */
gulp.task('watch:suiteapp', () => {
  gulp.watch(paths.src, gulp.series('deploy:suiteapp'));
});

/**
 * Full deploy
 */
gulp.task(
  'deploy',
  gulp.series('clean:suiteapp', 'deploy:suiteapp')
);
