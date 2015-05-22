var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var order = require('gulp-order');
var stylus = require('gulp-stylus');
var es = require('event-stream');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var server = require('gulp-express');


var config = {
    port : 3000,

    components : [
        'public/bower_components/underscore/underscore.js',
        'public/bower_components/jquery/dist/jquery.js',
        'public/bower_components/jquery-ui/jquery-ui.js',
        'public/bower_components/bootstrap/dist/js/bootstrap.js',
        'public/bower_components/angular/angular.js',
        'public/bower_components/angular-route/angular-route.js',
        'public/bower_components/angular-ui-date/src/date.js',
        'public/bower_components/ng-sortable/dist/ng-sortable.js',
        'public/bower_components/angular-cookies/angular-cookies.js'
    ],

    app : [
        'public/js/app/*.js',
        'public/js/controllers/*.js',
        'public/js/directives/*.js'
    ],

    jsDist : 'public/js',
    jsFileName : 'scripts.js',
    cssDist : 'public/css',
    cssFileName : 'styles.css',

    stylusOptions : {
        compress : true,
        linenos : false
    },

    autoprefixerOptions : {
        browsers: ['last 2 versions'],
        cascade: true
    }
};

// Javascript concat
gulp.task('js:components', function() {
    //concat components
    return gulp.src(config.components)
        .pipe(concat('components.js'))
        .pipe(gulp.dest(config.jsDist));
});

gulp.task('js:app', function() {
    //concat app
    return app = gulp.src(config.app)
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.jsDist))
});

//Stylus building
gulp.task('stylus', function() {
    return gulp.src('public/styl/styles.styl')
        .pipe(stylus(config.stylusOptions))
        .pipe(autoprefixer(config.autoprefixerOptions))
        .pipe(gulp.dest(config.cssDist))
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run({
        file: './bin/www'
    });
});


//watcher
gulp.task('watch', function() {
    gulp.watch('public/styl/**', ['stylus']);
    gulp.watch(config.components, ['js:components']);
    gulp.watch(config.app, ['js:app']);
});

gulp.task('default', ['server', 'js:components', 'js:app', 'stylus', 'watch']);

