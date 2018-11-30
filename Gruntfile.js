module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ["./public/stylesheets"],
          yuicompress: true
        },
        files: {
          "./public/stylesheets/home.css": "./public/stylesheets/home.less"
        }
      }
    },
    watch: {
      files: "./public/stylesheets/*.less",
      tasks: ["less"]
    }
  });
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
};
