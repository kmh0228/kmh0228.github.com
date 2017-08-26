
	//定义gulp模块
	var gulp = require('gulp');
	//定义压缩模块
	var uglify = require('gulp-uglify');
	
	//定义任务
	gulp.task('uglify',function(){
		return gulp.src('a.js')
			.pipe(uglify())
			//.pip(rename('b.js'))
			.pip(gulp.dest('b.js'));
	});
	
	gulp.task('default',[uglify]);
	


	//监控文件
	gulp.task('watch',function(){
		return gulp.watch('a.js',['uglify']);
	});
