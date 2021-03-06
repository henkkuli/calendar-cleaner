const gulp = require('gulp');
const ts = require('gulp-typescript');
const path = require('path');
const merge = require('merge2');
const child_process = require('child_process');
const FileCache = require('gulp-file-cache');
const typescript = require('typescript');
const fs = require('fs');

const clientConfigPath = path.join(__dirname, 'src/client/tsconfig.json');
const clientProject = ts.createProject(clientConfigPath);
const clientSrc = ['src/client/**/*.ts', 'src/common/**/*.ts'];

const serverConfigPath = path.join(__dirname, 'src/server/tsconfig.json');
const serverProject = ts.createProject(serverConfigPath);
const serverSrc = ['src/server/**/*.ts', 'src/common/**/*.ts'];

const staticSrc = ['src/static/**/*'];

const libBase = `node_modules`;
const libSrc = [
    `${libBase}/core-js/client/shim.min.js`,
    `${libBase}/zone.js/dist/zone.js`,
    `${libBase}/reflect-metadata/Reflect.js`,
    `${libBase}/systemjs/dist/system.src.js`,
    `${libBase}/rxjs/**/*.js`,
    `${libBase}/@angular/**/bundles/*.umd.js`,
];

const serverDest = 'dist';
const clientDest = 'dist/static';
const staticDest = 'dist/static';
const libDest = `${staticDest}/lib`;

const serverExecutable = 'dist/index.js';

const fileCache = new FileCache();
const tsReporter = ts.reporter.longReporter();

gulp.task('client', function () {
    var tsResult = gulp
        .src(clientSrc)
        .pipe(clientProject(tsResult));

    return merge([
        tsResult.js.pipe(gulp.dest(clientDest))
    ]);
});
gulp.task('server', function () {
    var tsResult = gulp
        .src(serverSrc)
        .pipe(serverProject(tsResult));

    return merge([
        tsResult.js.pipe(gulp.dest(serverDest))
    ]);
});
gulp.task('static', function () {
    return gulp
        .src(staticSrc)
        .pipe(fileCache.filter())
        .pipe(gulp.dest(staticDest))
        .pipe(fileCache.cache());
});
gulp.task('lib', () => {
    return gulp.src(libSrc, { base: libBase })
        .pipe(gulp.dest(libDest));
});

gulp.task('default', ['client', 'server', 'static', 'lib']);

gulp.task('watch', ['default'], function () {
    gulp.watch(clientSrc, ['client']);
    gulp.watch(serverSrc, ['server']);
    gulp.watch(staticSrc, ['static']);
});

gulp.task('develop', ['watch'], function () {

    let child = null;;
    let busy = false;

    function spawn() {
        child = child_process.fork(serverExecutable);
        busy = false;
    }

    gulp.watch(serverSrc, ['server', function () {
        if (busy)
            return;

        busy = true;
        child.once('exit', spawn);
        child.kill();
    }]);

    spawn();
});
