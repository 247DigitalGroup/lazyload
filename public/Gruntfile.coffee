module.exports = (grunt) ->

  grunt.initConfig

    notify_hooks:
      options:
        enabled: true
        max_jshint_notifications: 6
        title: 'Magz Design - Gia Gần Gũi'
        success: false
        duration: 3

    notify:
      scripts:
        options:
          title: 'Script updated'
          message: 'File changes...'
      stylesheets:
        options:
          title: 'Stylesheet updated'
          message: 'File changes...'
      jade:
        options:
          title: 'Document markup updated'
          message: 'File changes...'
      copy:
        options:
          title: 'New files updated'
          message: 'File changes...'

    copy:
      build:
        expand: true
        cwd: 'source'
        dest: 'build'
        src: ['**', '!**/*.styl', '!**/*.jade', '!**/*.coffee', '!components/**']
      bower:
        expand: true
        cwd: 'source'
        dest: 'build'
        src: ['components/**']

    clean:
      build:
        src: ['build']

    stylus:
      build:
        options:
          linenos: false
          compress: true
        files: [
          expand: true
          cwd: 'source'
          dest: 'build'
          src: ['css/app.styl', 'css/fonts.styl', 'css/tables.styl', 'css/blocks.styl', 'css/acp.styl']
          rename: (dest, src) ->
            dest + '/' + src.replace /\.styl$/, '.css'
        ]

    autoprefixer:
      build:
        expand: true
        cwd: 'build'
        dest: 'build'
        src: ['build/**/*.css', '!build/components/**']

    cssmin:
      build:
        files:
          'build/application.css': ['build/**/*.css', '!build/components/**']

    coffee:
      build:
        expand: true
        cwd: 'source'
        dest: 'build'
        src: ['**/*.coffee']
        rename: (dest, src) ->
          dest + '/' + src.replace /\.coffee$/, '.js'

    uglify:
      build:
        options:
          mangle: false
        files:
          'build/application.js': ['build/**/*.js']

    jade:
      compile:
        options:
          pretty: true
          data: {}
        files: [
          expand: true
          cwd: 'source'
          dest: 'build'
          src: ['**/*.jade']
          ext: '.html'
        ]

    imagemin:
      dynamic:
        file: [{
          expand: true
          cwd: 'build/images'
          dest: 'build/images'
          src: ['**/*.{png,jpg,gif}']
        }]

    watch:
      options:
        spawn: false
        livereload: false
      scripts:
        files: 'source/**/*.coffee'
        tasks: ['scripts', 'notify:scripts']
      stylesheets:
        files: 'source/**/*.styl'
        tasks: ['stylesheets', 'notify:stylesheets']
      # foundation:
      #   files: 'source/foundation/**/*.scss'
      #   tasks: ['scss']
      jade:
        files: 'source/**/*.jade'
        tasks: ['jade', 'notify:jade']
      copy:
        files: [
          'source/**',
          '!source/**/*.styl',
          '!source/**/*.coffee',
          '!source/**/*.jade'
        ]
        tasks: ['copy']

    connect:
      server:
        options:
          hostname: '*'
          port: 7070
          base: 'build/'

  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-autoprefixer'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-imagemin'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-newer'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-notify'

  grunt.event.on 'watch', (action, filepath) ->
    grunt.config 'jade.compile.files[0].src', filepath
    console.log action
    console.log filepath

  grunt.task.run 'notify_hooks'

  grunt.registerTask 'default', ['connect::keepalive']
  grunt.registerTask 'dev-stylesheets', '', ['newer:stylus:build']
  grunt.registerTask 'dev-scripts', '', ['newer:coffee:build']
  grunt.registerTask 'dev-html', '', ['newer:jade:compile']
  grunt.registerTask 'stylesheets', 'Compiles the stylesheets', ['stylus:build']
  # grunt.registerTask 'stylesheets', 'Compiles the stylesheets', ['stylus:build', 'autoprefixer:build', 'cssmin:build']
  grunt.registerTask 'scripts', 'Compiles the scripts', ['coffee:build']
  # grunt.registerTask 'scripts', 'Compiles the scripts', ['coffee:build', 'uglify:build']

  grunt.registerTask 'dev', ['build', 'connect', 'watch']
  grunt.registerTask 'build', 'Compiles all', ['clean:build', 'copy:build', 'stylesheets', 'scripts', 'jade:compile', 'copy:bower', 'imagemin:dynamic']
