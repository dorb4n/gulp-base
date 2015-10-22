//include gulp
var gulp = require('gulp');

//include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var order = require("gulp-order");
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// gulp tasks
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('base.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('.tmp/js'));
});

gulp.task('sass', function () {
    return sass('src/sass/styles.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.tmp/css'));
});

gulp.task('concat-css', function () {
    var css_files = ['bower_components/normalize-css/normalize.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        '.tmp/css/styles.css'];
    return gulp.src(css_files)
        .pipe(concat('package.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('concat-js', function () {
    var js_files = ['bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/modernizr/modernizr.js',
        '.tmp/js/base.min.js'];
    return gulp.src(js_files)
        .pipe(concat('package.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 10, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/images'));
});

//gulp watch
gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', ['scripts', 'concat-js']);
    gulp.watch('src/sass/**/*.scss', ['sass', 'concat-css']);
});

// default task
gulp.task('default', ['scripts', 'sass', 'concat-css', 'concat-js', 'images', 'watch']);
