module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        jshint: {
            options: {
                browser: true
            }
        },
        uglify: {
            options: {
                compress: true
            },
            dist: {
                src: ['js/debug/panorama.js'],
                dest: 'js/panorama.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['uglify']);

};