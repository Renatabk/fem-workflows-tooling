#global module:false
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig

    # Metadata.
    pkg: grunt.file.readJSON("package.json")
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n"

    # Task configuration.
    clean:
      dist: ["dist"]

    concat:
      app:
        dest: "dist/js/app.js"
        src: ["vendor/js/jquery.js", "vendor/js/angular.js", "vendor/js/underscore.js", "vendor/js/**/*.js", "js/config/**/*.js", "js/app.js", "js/data/**/*.js", "js/directives/**/*.js", "js/controllers/**/*.js", "js/**/*.js"]

    uglify:
      options:
        banner: "<%= banner %>"

      dist:
        src: "<%= concat.app.dest %>"
        dest: "dist/js/app.min.js"

    less:
      development:
        options:
          paths: ["css"]
          ieCompat: false

        files:
          "dist/css/style.css": "css/style.less"

      production:
        options:
          paths: ["css"]
          yuicompress: true
          ieCompat: false

        files:
          "dist/css/style.min.css": "css/style.less"

    copy:
      html:
        src: "index.html"
        dest: "dist/index.html"

      images:
        src: "img/**/*"
        dest: "dist/img/"

    watch:
      options:
        livereload: true

      app:
        files: ["<%= concat.app.src %>", "<%= copy.html.src %>"]
        tasks: ["concat", "copy"]

    server:
      base: "dist"
      web:
        port: 8000

  grunt.loadTasks "tasks"

  # Loads all plugins that match "grunt-", in this case all of our current plugins
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks)

  # Default task.
  grunt.registerTask "default", ["clean", "less:development", "concat", "copy", "server", "watch"]
  grunt.registerTask "build", ["clean", "less:production", "concat", "uglify", "copy"]