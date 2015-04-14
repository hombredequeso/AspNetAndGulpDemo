var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    watch = require('gulp-watch'),
    cachebuster = require('gulp-cachebust'),

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

gulp.task('clean', function () {
    'use strict';
    del.sync(appBundles.map(function (bundle) {
         return bundleDestination + '/' + wildcardBustedScript(bundle.minifiedScript);
    }));
    del.sync(appBundles.map(function (bundle) {
        return bundleDestination +'/' + mapFileName(wildcardBustedScript(bundle.minifiedScript));
    }));
});

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

gulp.task('default', ['build']);