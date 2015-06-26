var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');
var karma         = require('karma').server;
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;

gulp.task('scripts', function () {
    return gulp
        .src('src/entry.js')
        .pipe($.webpack(webpackConfig))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/*.js', ['scripts']);
    gulp.watch('*.scss', ['styles']);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('styles', function () {
    return gulp
        .src('*.scss')
        .pipe($.sass({ outputStyle: 'compressed' }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest(''));
});

gulp.task('serve', ['default'], function () {
    browserSync({ notify: false, port: 9000, server: { baseDir: ['.'] } });
    gulp.watch(['*.css', 'dist/*.js', 'index.html']).on('change', reload);
    gulp.run('watch');
});

gulp.task('default', ['scripts']);
