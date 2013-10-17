#global module:false
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig

    # Metadata.
    pkg: grunt.file.readJSON("package.json")
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n"

    # Task configuration.
    clean:
      dist: ["dist", "generated"]

    coffee:
      pre_concat:
        expand: true
        cwd: 'app/js'
        src: ['**/*.coffee']
        dest: 'generated/compiled-coffee'
        ext: '.js'

    concat:
      app:
        dest: "dist/js/app.min.js"
        src: [
          "vendor/js/jquery.js"
          "vendor/js/angular.js"
          "vendor/js/underscore.js"
          "vendor/js/**/*.js"
          "generated/compiled-coffee/config/**/*.js"
          "generated/compiled-coffee/app.js"
          "generated/compiled-coffee/data/**/*.js"
          "generated/compiled-coffee/directives/**/*.js"
          "generated/compiled-coffee/controllers/**/*.js"
          "generated/compiled-coffee/**/*.js"
        ]

    uglify:
      options:
        banner: "<%= banner %>"

      dist:
        src: "<%= concat.app.dest %>"
        dest: "dist/js/app.min.js"

    less:
      options:
        paths: ["app/css"]
        ieCompat: false

      development:
        files:
          "dist/css/style.min.css": "app/css/style.less"

    open:
      dev:
        path: "http://localhost:8000"

    cssmin:
      styles:
        files:
          "dist/css/style.min.css" : "dist/css/style.min.css"

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
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks)

  # Default task.
  grunt.registerTask "default", ["clean", "less", "coffee", "concat", "copy", "server", "open", "watch"]
  grunt.registerTask "build", ["clean", "less", "cssmin", "coffee", "concat", "uglify", "copy"]
  grunt.registerTask "prodsim", ["build", "server", "open", "watch"]