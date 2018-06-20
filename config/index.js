module.exports = {
  port: 8899,
  filePath: {
    devhtml: ['src/*.html', 'src/**/*.html', '!src/components/*.html'],
    disthtml: 'dist/',

    devcss: ['src/css/*.*', 'src/css/**/*.*'],
    distcss: 'dist/css',

    devjs: ['src/js/*.*', 'src/js/**/*.*'],
    distjs: 'dist/js',

    devimg: ['src/img/*.*', 'src/img/**/*.*'],
    distimg: 'dist/img',

    devlib: ['src/lib/*.*', 'src/lib/**/*.*'],
    distlib: 'dist/lib'
  }
};
