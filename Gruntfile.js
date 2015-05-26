module.exports = function(grunt) {
    grunt.initConfig({
        uncss: {
        dist: {
          files: {
                'css/rti.css': ['uncss.html', 'data_uncss.html', 'interestSet.html']
            }
        }
      }
    });
    grunt.loadNpmTasks('grunt-uncss');
    grunt.registerTask('default', 'uncss');
}
