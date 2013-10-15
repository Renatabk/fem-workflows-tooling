module.exports = (grunt) ->

  config =
    imagemin:
      all_images:
        files: [
          expand: true
          src: ["img/**/*.png"]
          dest: "."
        ]

  grunt.loadNpmTasks("grunt-contrib-imagemin")

  grunt.registerTask "default", ["imagemin"]

  grunt.initConfig(config)

