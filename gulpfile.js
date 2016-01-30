var gulp = require('gulp');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var esdoc = require('gulp-esdoc');
var ghPages = require('gulp-gh-pages')
var open = require('open')
var os = require('os')
var package = require('./package.json')
var path = require('path')
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
		esdoc: 'documentation/esdoc'
	}
};

var ghPagesSettings = {
	url: package.homepage,
	src: path.join(paths.dest.esdoc, '/**/*'),
	ghPages: {
		cacheDir: path.join(os.tmpdir(), package.name)
	}
}

gulp.task('deploy-esdoc', ['clean-js', 'babel', 'document-js'], function() {
	return gulp.src(ghPagesSettings.src)
		.pipe(ghPages(ghPagesSettings.ghPages))
		.on('end', function(){
			open(ghPagesSettings.url)
		});
});

function throwError (error) {
	gutil.log(gutil.colors.red(error.toString()));
	this.emit('end');
}

gulp.task('document-js', function(){
	gulp.src(paths.src.jsRoot)
		.pipe(esdoc({ destination: paths.dest.esdoc }))
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
