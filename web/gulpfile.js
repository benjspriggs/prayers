/**
 * This file defines build and development tasks.
 */
const { src, dest, parallel, watch} = require('gulp');
const fileInclude = require('gulp-file-include');
const size = require('gulp-size');
const browserSync = require('browser-sync');
const browserSyncConfig = require('./bs-config');

const BUILD_OUTPUT_DIRECTORY = './out';
const SOURCES = ['./static/**/*', ];
const FILE_INCLUDE_SOURCES = ['./html/**/*', './components/**/*'];

/**
 * Serves a static site. Assumes that sources have already been built.
 */
function serve(cb) {
    browserSync.init(browserSyncConfig, cb);
}

/**
 * Copies static assets to the output directory.
 */
function copy() {
    return src(SOURCES)
    .pipe(size({
        title: 'static',
        showFiles: true,
    }))
    .pipe(dest(BUILD_OUTPUT_DIRECTORY));
}

/**
 * Builds sources.
 */
function include() {
    return src(FILE_INCLUDE_SOURCES)
        .pipe(fileInclude({
            basepath: '@root'
        }))
        .pipe(size({
            title: 'include',
            showFiles: true,
        }))
        .pipe(dest(BUILD_OUTPUT_DIRECTORY));
}

/**
 * Watches sources that can change during development and updates browsersync.
 */
function watchSources() {
    browserSync.init(browserSyncConfig);

    watch(FILE_INCLUDE_SOURCES, include).on('change', browserSync.reload);
    watch(SOURCES, copy).on('change', browserSync.reload);
}

exports.watch = watchSources;
exports.build = parallel(copy, include);
exports.default = serve;