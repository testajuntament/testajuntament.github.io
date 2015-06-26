var gulp = require('gulp');
var notify = require('gulp-notify');
var gutil = require('gulp-util');

var compass = require('gulp-compass');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

var concat = require('gulp-concat');


var del = require('del');
var rename = require('gulp-rename');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var paths = {
  scripts: [
    'bower_components/angular/angular.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-locale_es-es/angular-locale_es-es.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'js/vendor/jquery.matchHeight-min.js',
    'js/vendor/jquery.flexslider-min.js',
    'js/vendor/angular-flexslider.js',
    'js/vendor/angular-paginator.js',
    'js/vendor/moment/min/moment-with-langs.js',
    'js/vendor/angular-moment/angular-moment.js',
    // 'js/*.*'
    // 'js/main.js*'
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
  	'js/main.js*'
  ],
  // images: 'assets/img/**/*s',
  styles: [
  	'sass/**/*.scss'
  ]
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    // .pipe(compass({
    //   sass: 'sass'
    // }))
		.pipe(sass({
			includePaths: [
			'./bower_components/bootstrap-sass/assets/stylesheets/',
			'./bower_components/font-awesome/scss/'
			]
		}))
		.on('error', function (err) { console.log(err.message); })
		.on('error', gutil.log )
		.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(concat('main.css'))
		// .pipe(minifycss())
		.pipe(gulp.dest('./css'))
		.pipe(notify({ message: 'styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp
	    .src(paths.scripts)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
	    // .pipe(uglify()).pipe(uglify().on('error', gutil.log))
	      .pipe(rename({suffix:'.min'}))
	      .pipe(gulp.dest('./buildjs'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'watch');
});	