const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const wait = require('gulp-wait');

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const svgmin = require('gulp-svgmin');

const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');

const runSequence = require('run-sequence');



gulp.task('optimized-png', function() {
	(async () => {
		await imagemin(['img/*.png'], 'build/img', {
			plugins: [
				imageminPngquant()
			]
		});

		console.log('Images optimized PNG');
	})();
});

gulp.task('optimized-jpg',function () {
	(async () => {
		await imagemin(['img/*.jpg'], 'build/img', {
			use: [
				imageminMozjpeg()
			]
		});

		console.log('Images optimized JPG');
	})();
});

gulp.task('optimized-svg',function () {

	return gulp.src('img/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('build/img'));

	console.log('Images optimized SVG');

});

gulp.task('autoprefixer-and-cleanCSS',function () {
	gulp.src('css/main.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('build/css/'));

	console.log('Autoprefixer and clean CSS');
});

gulp.task('minify-html',function () {
	return gulp.src('*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('build'));

	console.log('Clean Html');
});

gulp.task('compress-js',function () {
	return gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js/'));
	console.log('Uglyfy Js')

});

gulp.task('dist-web', function (cb) {
	runSequence(
		'optimized-png',
		'optimized-jpg',
		'optimized-svg',
		'autoprefixer-and-cleanCSS',
		'minify-html',
		'compress-js',
		cb
	);
	console.log('Dist Web finished')
});


gulp.task('reload', function(){
    browserSync.reload();
});

gulp.task('serve',['sass'], function(){
    browserSync({
        server: './'  // W jakim folderze mam szukac plików do przełądowania 
    });
    
    gulp.watch('./*.html', ['reload']); // nasłuchuje zmiany w pliku html gdy coś                                             //znajdzie odpala zdarzenie reload
    gulp.watch('./scss/*/*.scss' ,['sass']);
    gulp.watch('./scss/main.scss' ,['sass']);
});

gulp.task('sass', function(){
    return gulp.src('./scss/main.scss')   // wszytskie pliki z rozszezenie scss wez
    .pipe(wait( 500 )) 
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError)) // sprawdź czy nie ma z nim problemów
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./css'))              // zapisz je zamieniona na css w pliku css
    .pipe(browserSync.stream());             // refresh browser
});


gulp.task('default', ['serve']);