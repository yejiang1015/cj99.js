
// const imagemin = require('gulp-imagemin'); //  停用 图片压缩
// const imageminJpegRecompress = require('imagemin-jpeg-recompress'); // 停用
// const imageminOptipng = require('imagemin-optipng'); // 停用
const uglify = require('gulp-uglify'); // 停用

const gulp = require('gulp');
const colors = require('colors');
const gulpHtml = require('gulp-html-tpl');
const artTemplate = require('art-template');
const del = require('del');
const runSequence = require('run-sequence');
const gulpLess = require('gulp-less');
const cleancss = require('gulp-clean-css'); // gulp-minify-css 官方弃用 css压缩
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

const connect = require('gulp-connect'); // 启动服务提供热更新
const plumber = require('gulp-plumber'); // gulp 任务错误处理
const clear = require('clear');
const os = require('os');
const config = require('./config');

const LessAutoprefix = require('less-plugin-autoprefix');

const port = config.port;
const filePath = config.filePath;

const gulpTaskCallback = function(name) {
  setTimeout(() => {
    console.log(clear([{ fullClear: false }]));
    if (typeof name !== 'string') {
      console.error(`${name}`.red);
    } else {
      console.log('App watching at:'.gray);
      console.log('- Module: '.gray + name.green + '\n');
      console.log('App running at:'.gray);
      console.log('- Local:'.gray + `   http://localhost:${port}`.green);
      if (os.networkInterfaces().en0) {
        const osaddr = os.networkInterfaces().en0[1].address;
        console.log('- Network:'.gray + ` http://${osaddr}:${port}`.green);
      }
    }
  }, 200);
};

gulp.task('html', function() {
  gulpTaskCallback('html');
  return gulp
    .src(filePath.devhtml)
    .pipe(
      plumber({
        errorHandler: error => {
          this.emit('end');
          gulpTaskCallback(error);
        }
      })
    )
    .pipe(
      gulpHtml({
        tag: 'template',
        paths: ['src/components/'],
        engine: function(template, data) {
          return artTemplate.compile(template)(data);
        },
        data: {
          useHeader: false
        },
        beautify: {
          indent_char: ' ',
          indent_with_tabs: false
        }
      })
    )
    .pipe(gulp.dest(filePath.disthtml))
    .pipe(connect.reload());
});

gulp.task('css', function() {
  gulpTaskCallback('css');
  return (
    gulp
      .src(filePath.devcss)
      .pipe(
        plumber({
          errorHandler: error => {
            this.emit('end');
            gulpTaskCallback(error);
          }
        })
      )
      .pipe(
        gulpLess({
          plugins: [new LessAutoprefix({ browsers: ['last 10 versions'] })]
        })
      )
      .pipe(cleancss())
      .pipe(concat('style.css'))
      .pipe(gulp.dest(filePath.distcss))
      .pipe(connect.reload())
  );
});

gulp.task('js', function() {
  gulpTaskCallback('js');
  return gulp
    .src(filePath.devjs)
    .pipe(
      plumber({
        errorHandler: error => {
          this.emit('end');
          gulpTaskCallback(error);
        }
      })
    )
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename('cj99.min.js'))
    .pipe(gulp.dest(filePath.distjs))
    .pipe(connect.reload());
});

gulp.task('img', function() {
  gulpTaskCallback('img');
  return gulp
    .src(filePath.devimg)
    .pipe(
      plumber({
        errorHandler: error => {
          this.emit('end');
          gulpTaskCallback(error);
        }
      })
    )
    .pipe(gulp.dest(filePath.distimg))
    .pipe(connect.reload());
});

gulp.task('lib', function() {
  gulpTaskCallback('lib');
  return gulp
    .src(filePath.devlib)
    .pipe(
      plumber({
        errorHandler: error => {
          this.emit('end');
          gulpTaskCallback(error);
        }
      })
    )
    .pipe(gulp.dest(filePath.distlib))
    .pipe(connect.reload());
});

gulp.watch('src/**/*.*', function(event) {
  /**
   * watch to deleted and renamed and added
   * 文件变更重启gulp服务
   ** watch 文件变更非修改
   */
  if (event.path.match(/src\/(\S*)/) && event.type !== 'changed') {
    console.log(`[event.type] '${event.type}'`.red);
    gulp.start('clean');
  }
});

gulp.task('watch', function() {
  /**
   ** watch task
   */
  gulp.watch(['src/css/**'], ['css']);
  gulp.watch(['src/js/**'], ['js']);
  gulp.watch(['src/img/**'], ['img']);
  gulp.watch(['src/lib/**'], ['lib']);
  gulp.watch(['src/**/*.html', 'src/*.html'], ['html']);
});

gulp.task('connect', function() {
  connect.serverClose();
  connect.server({
    name: 'gulp-connect',
    root: 'dist',
    host: '0.0.0.0',
    port: port,
    livereload: true
  });
});

gulp.task('clean', function() {
  del(['dist']).then(() => {
    runSequence(['html', 'css', 'js', 'img', 'lib']);
  });
});

gulp.task('default', ['connect', 'clean', 'watch']);
