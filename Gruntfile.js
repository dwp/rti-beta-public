module.exports = function(grunt) {
    grunt.initConfig({
        uncss: {
        dist: {
          files: {
                'css/rti.css': ['nino.html', 'data_all.html', 'interestSet.html']
            }
        }
      }
    });
    grunt.loadNpmTasks('grunt-uncss');
    grunt.registerTask('default', 'uncss');
}
