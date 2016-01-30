var gulp = require('gulp');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var esdoc = require('gulp-esdoc');
var paths = {
	src: {
		root: 'src',
		jsRoot: 'src/js',
		javascript: [
			'!src/js/libs/**',
			'src/js/**/*.js'
		]
	},
	dest: {
		root: 'dest',
		index: 'dest/js/index.js',
		javascript: 'dest/js',
		jsdoc: 'documentation/jsdoc'
	}
};

function throwError (error) {
	gutil.log(gutil.colors.red(error.toString()));
	this.emit('end');
}

gulp.task('document-js', function(){
	gulp.src(paths.src.jsRoot)
		.pipe(esdoc({ destination: paths.dest.jsdoc }))
		.on('error', throwError);
});

gulp.task('clean-js', function(){
	gulp.src(paths.dest.root + 'js')
		.pipe(plumber())
		.pipe(rimraf({ read: false }))
		.on('error', throwError);
});

gulp.task('serve', ['babel'], function(){
	nodemon({
		'script': paths.dest.index,
		'ignore': ['audio', 'src']
	})
	.on('crash', function() {
		gutil.log(gutil.colors.red('Nodemon crashed!!'));
	})
	.on('exit', function() {
		gutil.log(gutil.colors.red('Nodemon did exit!!'));
	});
});

gulp.task('lint-js', function() {
	return gulp.src(paths.src.javascript)
		.pipe(eslint())
		.pipe(eslint.formatEach());
});

gulp.task('babel', ['lint-js'], function() {
	return gulp.src(paths.src.javascript)
		.pipe(plumber())
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest(paths.dest.javascript))
		.on('error', throwError);
});

gulp.task('watch', ['clean-js', 'serve'], function() {
	gulp.watch(paths.src.javascript, ['babel']);
});
