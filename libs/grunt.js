// Interface for HelperPress's Grunt
// Pretty much replaces the need for grunt-cli


module.exports = function(task, options, path){

	var hpPath = path + '/node_modules/helperpress',
		gruntPath = hpPath + '/node_modules/grunt/lib/grunt.js';

	// add some options we'll always need
	options.gruntfile = hpPath + '/Gruntfile.js';
	options.projectdir = path;

	// load Grunt
	require(gruntPath).tasks(task, options);
};