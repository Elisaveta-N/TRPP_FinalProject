const{src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const clean = require('gulp-clean');

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
    watch('app/**/*.css').on('change', browserSync.reload);
    watch('app/**/*.html').on('change', browserSync.reload);
}

function buildcopy() {
	return src([ // Выбираем нужные файлы
		'app/**/*.css',
		'app/js/**/*.min.js',
		'app/img/**/*',
		'app/**/*.html',
		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
	return src('dist', {allowEmpty: true}).pipe(clean()) // Удаляем папку "dist/"
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.build = series(cleandist, scripts, buildcopy);
exports.default = parallel(scripts, browsersync, startwatch);