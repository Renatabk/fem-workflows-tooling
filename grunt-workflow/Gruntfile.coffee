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

    newer:
      options:
        timestamps: "generated/timestamps"

    coffee:
      compile:
        expand: true
        cwd: 'app/js'
        src: '**/*.coffee'
        dest: 'generated/compiled-coffee'
        ext: '.js'

    concat:
      app:
        dest: "dist/js/app.min.js"
        src: [
          "bower_modules/jquery/jquery.js"
          "bower_modules/underscore/underscore.js"
          "bower_modules/underscore.string/lib/underscore.string.js"
          "bower_modules/extend.js/index.js"
          "bower_modules/backbone/backbone.js"
          "bower_modules/backbone-fixins.js/index.js"
          "bower_modules/backbone.stickit/backbone.stickit.js"
          "bower_modules/base64js/base64.js"
          "bower_modules/handlebars/handlebars.js"
          "<%= handlebars.compile.dest %>"
          "generated/compiled-coffee/config/**/*.js"
          "generated/compiled-coffee/converters.js"
          "generated/compiled-coffee/data/**/*.js"
          "generated/compiled-coffee/models/**/*.js"
          "generated/compiled-coffee/**/*.js"
        ]

    handlebars:
      options:
        namespace: "JST"
        wrapped: true
      compile:
        src: "app/templates/**/*.hb"
        dest: "generated/templates/handlebars-template-cache.js"

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

    watch:
      coffee:
        files: ["app/js/**/*.coffee"]
        tasks: ["newer:coffee"]

      app:
        options:
          livereload: true
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
  grunt.registerTask "default", ["less", "handlebars", "newer:coffee", "concat", "copy", "server", "open", "watch"]
  grunt.registerTask "build", ["clean", "less", "cssmin", "handlebars", "coffee", "concat", "uglify", "copy"]
  grunt.registerTask "prodsim", ["build", "server", "open", "watch"]
