var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    watch = require('gulp-watch'),
    cachebuster = require('gulp-cachebust'),
    watch = require('gulp-watch'),
    karma = require('karma').server,

    bundleDestination = 'Scripts/appBundles/',
    appBundles = [
        {
            scripts: [
                'MyDomain/Scripts/*.js'
            ],
            minifiedScript: 'myDomain.min.js',
        },
    ],
    wildcardBustedScript = function (scriptName) {
        var jsExtPos = scriptName.indexOf('.js'),
            startStr = scriptName.substring(0, jsExtPos);
        return startStr + '.*' + '.js';
    },
    mapFileName = function (scriptName) {
        'use strict';
        return scriptName + ".map";
    };

//===================================================================
// Tasks related to the javascript build pipeline.
//===================================================================

// Clean will wipe all files created a consequence of build.
gulp.task('clean', function () {
    'use strict';
    del.sync(appBundles.map(function (bundle) {
         return bundleDestination + '/' + wildcardBustedScript(bundle.minifiedScript);
    }));
    del.sync(appBundles.map(function (bundle) {
        return bundleDestination +'/' + mapFileName(wildcardBustedScript(bundle.minifiedScript));
    }));
});

// Build runs the gulp pipeline to create the concatenated, minified, busted *.min.js file
// and its corresponding *.js.map file.

gulp.task('build', ['clean'], function () {
    'use strict';
    var buster = new cachebuster();
    appBundles.forEach(function (appBundle) {
        gulp.src(appBundle.scripts)
            .pipe(sourcemaps.init())
            .pipe(concat(appBundle.minifiedScript))
            .pipe(uglify())
            .pipe(buster.resources())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(bundleDestination));
    });
});

// Just running "gulp" will perform a build by default.
gulp.task('default', ['build']);

//===================================================================
// Additional (optional) tasks, depending on chosen environement
// for front end development.
// If front end development is usually done in Visual Studio,
// the following tasks are most likely going to prove useful.
//
// Note that for demo purposes (clarity) the following functions only
// operate on appBundle[0]
// On a real system the following would need to deal with multiple
// appBundles (as the previous tasks do)
//===================================================================


// A watch task can be setup to perform a build task whenever any
// source javascript file changes. 
// Running this means the build will occur automatically 'on save',
// essentially automating this front end development job.
gulp.task('watch', function () {
    var myDomainAppBundle = appBundles[0];
    gulp.watch(myDomainAppBundle.scripts, ['build']);
});

// Karma tests can be run independently of visual studio,
// Hence javascript development with unit testing can be easily done
// outside Visual Studio.
// On the command line from within the MyDomain folder:
// > karma start

// Karma tests can also be setup to run as a gulp task, making them
// managable from with the Visual Studio Task Runner Explorer.
// Once started, karma has it's own watch system, so it is no necessary to
// do anything in this gulp file to achieve that.
gulp.task('runKarmaTests', function (done) {
    var myDomainKarmaConfig = __dirname + '/MyDomain/karma.conf.js';
    karma.start({
        configFile: myDomainKarmaConfig
    }, done);
});
