var gulp = require('gulp');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var nodemon = require('gulp-nodemon');
var paths = {
	src: {
		root: 'src',
		javascript: [
			'!src/js/libs/**',
			'src/js/**/*.js'
		]
	},
	dest: {
		root: 'dest',
		index: 'dest/js/index.js',
		javascript: 'dest/js'
	}
};

gulp.task('clean-js', function(){
	gulp.src(paths.dest.root + 'js')
		.pipe(rimraf({ read: false }));
});

gulp.task('serve', ['babel'], function(){
	nodemon({'script': paths.dest.index});
});

gulp.task('babel', ['clean-js'], function() {
	return gulp.src(paths.src.javascript)
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest(paths.dest.javascript));
});

gulp.task('watch', ['serve'], function() {
	gulp.watch(paths.src.javascript, ['serve']);
});
