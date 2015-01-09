// Interface for HelperPress's Grunt
// Pretty much replaces the need for grunt-cli

// var hpPath = __dirname + '../node_modules/helperpress',
var hpPath = '/Users/chuckmo/git-projects/helperpress',
	gruntPath = hpPath + '/node_modules/grunt/lib/grunt.js';

module.exports = function(task, options, path){

	// add some options we'll always need
	options.gruntfile = hpPath + '/Gruntfile.js';
	options.projectdir = path;

	// load Grunt
	require(gruntPath).tasks(task, options);
}