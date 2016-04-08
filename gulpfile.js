var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
    return gulp
        .src('src/demo.js')
        .pipe($.react())
        .pipe($.uglify())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task('styles', function () {
    return gulp
        .src('*.scss')
        .pipe($.sass({ outputStyle: 'compressed' }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/*.js', ['scripts']);
    gulp.watch('src/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'scripts']);
