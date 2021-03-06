/**
 * This file defines build and development tasks.
 */
const { src, dest, parallel, watch, series } = require("gulp");
const fileInclude = require("gulp-file-include");
const size = require("gulp-size");
const browserSync = require("browser-sync");
const browserSyncConfig = require("./bs-config");
const ts = require("gulp-typescript");
const del = require("del");
const sriHash = require("gulp-sri-hash");

const BUILD_OUTPUT_DIRECTORY = "./out";
const JAVASCRIPT_OUTPUT_DIRECTORY = "./out/js";
const SOURCES = ["./static/**/*"];
const FILE_INCLUDE_SOURCES = ["./html/**/*"];
const TYPESCRIPT_SOURCES = ["./src/**/*.ts", "./src/**/*.tsx"];

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
    .pipe(
      size({
        title: "static",
        showFiles: true
      })
    )
    .pipe(dest(BUILD_OUTPUT_DIRECTORY));
}

/**
 * Builds sources.
 */
function include() {
  return src(FILE_INCLUDE_SOURCES)
    .pipe(
      fileInclude({
        basepath: "@root"
      })
    )
    .pipe(
      size({
        title: "include",
        showFiles: true
      })
    )
    .pipe(dest(BUILD_OUTPUT_DIRECTORY));
}

/**
 * Watches sources that can change during development and updates browsersync.
 */
function watchSources() {
  browserSync.init(browserSyncConfig);

  watch([...FILE_INCLUDE_SOURCES, "./components/*.tmpl.html"], include).on(
    "change",
    browserSync.reload
  );
  watch(SOURCES, copy).on("change", browserSync.reload);
  watch(TYPESCRIPT_SOURCES, buildTypescript).on("change", browserSync.reload);
}

const typescriptProject = ts.createProject("./tsconfig.build.json");

function buildTypescript() {
  return typescriptProject
    .src()
    .pipe(typescriptProject())
    .pipe(
      size({
        title: "tsc",
        showFiles: true
      })
    )
    .pipe(dest(JAVASCRIPT_OUTPUT_DIRECTORY));
}

function generateHashes() {
  return src("./out/**/*.html")
    .pipe(sriHash())
    .pipe(
      size({
        title: "hash"
      })
    )
    .pipe(dest(BUILD_OUTPUT_DIRECTORY));
}

function clean() {
  return del(BUILD_OUTPUT_DIRECTORY);
}

exports.clean = clean;
exports.watch = watchSources;
exports.build = series(
  parallel(copy, include),
  buildTypescript,
  generateHashes
);
exports.default = serve;
