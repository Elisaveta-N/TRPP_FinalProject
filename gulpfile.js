const{src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;


function browsersync(){
    browserSync.init({
        server: {baseDir: 'app/'},
        notify: false,
        online: true
    })
}

function scripts(){
    return src([
        
        'app/script.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}

function startwatch(){
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.default = parallel(scripts, browsersync, startwatch);