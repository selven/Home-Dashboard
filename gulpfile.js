var child = require('child_process');
var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['server', 'sass', 'watch']);

gulp.task('server', function() {
	var server = child.spawn('forever', ['-w', 'index.js']);
	var log = fs.createWriteStream('server.log', {flags: 'a'});
	server.stdout.pipe(log);
	server.stderr.pipe(log);
});

gulp.task('sass', function () {
	return gulp.src('./sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
	gulp.watch('./sass/*.scss', ['sass']);
});