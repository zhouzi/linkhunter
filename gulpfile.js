var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');
var karma         = require('karma').server;

gulp.task('scripts', function () {
    return gulp
        .src('src/entry.js')
        .pipe($.webpack(webpackConfig))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/*.js', ['scripts']);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', ['scripts']);
