/*
 * 五个常用的插件，使用时需要安装
 * grunt-contrib-uglify
	grunt-contrib-qunit
	grunt-contrib-concat
	grunt-contrib-jshint
	grunt-contrib-watch
 * 
 *  npm install grunt-contrib-uglify
 * 
 * */




module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src:'a.js',// 'src/<%= pkg.name %>.js',
        dest: 'b.js'//'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};