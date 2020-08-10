const gulp = require('gulp');
const bs = require('browser-sync').create();
const plugins = require('gulp-load-plugins');
const yargs = require('yargs');

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!yargs.argv.production;

// banner
function banner(done) {
    console.log(`                                                    `);
    console.log(`                                                    `);
    console.log(`  /$$$$$$  /$$                         /$$          `);
    console.log(` /$$__  $$|__/                        | $$          `);
    console.log(`| $$  \\__/ /$$ /$$$$$$/$$$$   /$$$$$$ | $$  /$$$$$$ `);
    console.log(`|  $$$$$$ | $$| $$_  $$_  $$ /$$__  $$| $$ /$$__  $$`);
    console.log(` \\____  $$| $$| $$ \\ $$ \\ $$| $$  \\ $$| $$| $$$$$$$$`);
    console.log(` /$$  \\ $$| $$| $$ | $$ | $$| $$  | $$| $$| $$_____/`);
    console.log(`|  $$$$$$/| $$| $$ | $$ | $$| $$$$$$$/| $$|  $$$$$$$`);
    console.log(` \\______/ |__/|__/ |__/ |__/| $$____/ |__/ \\_______/`);
    console.log(`                            | $$                    `);
    console.log(`         /$$   /$$          | $$   /$$              `);
    console.log(`        | $$$ | $$          |__/  | $$              `);
    console.log(`        | $$$$| $$  /$$$$$$   /$$$$$$$  /$$$$$$     `);
    console.log(`        | $$ $$ $$ /$$__  $$ /$$__  $$ /$$__  $$    `);
    console.log(`        | $$  $$$$| $$  \\ $$| $$  | $$| $$$$$$$$    `);
    console.log(`        | $$\\  $$$| $$  | $$| $$  | $$| $$_____/    `);
    console.log(`        | $$ \\  $$|  $$$$$$/|  $$$$$$$|  $$$$$$$    `);
    console.log(`        |__/  \\__/ \\______/  \\_______/ \\_______/    `);
    console.log(`                                                    `);
    console.log(`                                                    `);
    done();
}

// Static server
function server(done) {
    bs.init({
        server: {
            baseDir: './public',
        },
    });
    done();
}

function reload(done) {
    bs.reload();
    done();
}

function sass(done) {
    return (
        gulp
            .src('src/scss/style.scss')
            .pipe($.sourcemaps.init())
            .pipe($.sass().on('error', $.sass.logError))
            .pipe(
                $.autoprefixer({
                    browsers: ['last 2 versions', 'ie >= 11', 'ios >= 9'],
                    grid: false,
                })
            )
            // Comment in the pipe below to run UnCSS in production
            // .pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
            .pipe($.if(PRODUCTION, $.cssnano()))
            .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
            .pipe(gulp.dest('public/_css'))
            .pipe(bs.stream())
    );
}

function javascript(done) {
    return gulp
        .src('src/js/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('app.js'))
        .pipe(
            $.if(
                PRODUCTION,
                $.uglify().on('error', (e) => {
                    console.log(e);
                })
            )
        )
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest('public/_js'));
}

function watch() {
    gulp.watch('public/*.html', reload);
    gulp.watch('src/scss/**/*.scss', sass);
    gulp.watch('src/js/**/*.js').on('all', gulp.series(javascript, reload));
}

gulp.task(
    'default',
    gulp.series(gulp.parallel(banner, sass, javascript), server, watch)
);
gulp.task(
    'watch',
    gulp.series(gulp.parallel(banner, sass, javascript), server, watch)
);
gulp.task('build', gulp.parallel(banner, sass, javascript));
