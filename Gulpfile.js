var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var order = require('gulp-order');
var stylus = require('gulp-stylus');
var es = require('event-stream');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var open = require('gulp-open');

var config = {
    components : [
      'bower_components/angular/angular.js',
      'bower_components/jquery/dist/jquery.js'
    ],

    app : [
        'js/app/**'
    ],

    jsDist : 'js',
    jsFileName : 'scripts.js',
    cssDist : 'css',
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

// Javascript concatination

gulp.task('js:components', function() {
    //concat components
    return gulp.src(config.components)
        .pipe(uglify())
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
    var common = gulp.src('styl/common.styl')
            .pipe(stylus(config.stylusOptions))
            .pipe(autoprefixer(config.autoprefixerOptions));

    var blocks = gulp.src('styl/blocks.styl')
        .pipe(stylus(config.stylusOptions))
        .pipe(autoprefixer(config.autoprefixerOptions));

    return es.concat(common, blocks)
        .pipe(order(['common', 'blocks']))
        .pipe(concat(config.cssFileName))
        .pipe(gulp.dest(config.cssDist))
});

//server
gulp.task('connect', function() {
    connect.server({
        port: 8000
    });
});

//watcher
gulp.task('watch', function() {
    gulp.src('./index.html')
        .pipe(open('', {
            url: 'http://localhost:8000'
        }));

    gulp.watch('styl/**', ['stylus']);
    gulp.watch(config.components, ['js:components']);
    gulp.watch(config.app, ['js:app']);
});

gulp.task('default', ['connect', 'js:components', 'js:app', 'stylus', 'watch']);

