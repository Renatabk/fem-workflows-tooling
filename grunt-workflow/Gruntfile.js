/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      dist: ['dist']
    },
    concat: {
      app: {
        dest: 'dist/js/app.js',
        src: [
          "vendor/js/jquery.js",
          "vendor/js/angular.js",
          "vendor/js/underscore.js",
          "vendor/js/**/*.js",
          "js/config/**/*.js",
          "js/app.js",
          "js/data/**/*.js",
          "js/directives/**/*.js",
          "js/controllers/**/*.js",
          "js/**/*.js"
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.app.dest %>',
        dest: 'dist/js/app.min.js'
      }
    },
    copy: {
      html: {
        src: 'index.html',
        dest: 'dist/index.html'
      },
      css: {
        src: 'css/style.css',
        dest: 'dist/css/style.css'
      }
    },
    watch: {
      app_and_vendor_sources: {
        files: '<%= concat.app.src %>',
        tasks: ['concat', 'copy']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'copy']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'copy']);

};
