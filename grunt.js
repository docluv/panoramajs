module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'js/debug/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        min: {
            dist: {
                src: ['js/debug/panorama.js'],
                dest: 'js/panorama.min.js'
            }
        }
    });


    // Default task.
    grunt.registerTask('default', [/*"lint",*/'min']);

};