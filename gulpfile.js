/* jshint node: true */
var gulp = require('gulp');
var deploy = require("gulp-gh-pages");

gulp.task('deploy', function () {
  var options = {};
  gulp.src([
    '!bower.json',
    '!Guardfile',
    '!gulpfile.js',
    '!node_modules/**',
    '**'
  ]).pipe(deploy(options));
});
