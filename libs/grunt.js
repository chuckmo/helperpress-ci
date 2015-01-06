// Interface for HelperPress's Grunt
// Pretty much replaces the need for grunt-cli

var gruntPath = 'node_modules/helperpress/node_modules/grunt/lib/grunt.js';

module.exports = function(task, options){
	require(gruntPath).tasks(cli.tasks, cli.options, done);
}