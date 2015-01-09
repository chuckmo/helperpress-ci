#!/usr/bin/env node

'use strict';


var cli = require('commander'),
	findup = require('findup-sync'),

	pkg = require('../package.json'),
	runGrunt = require('../libs/grunt.js');

// determine current HP project path
var projectPath = findup( 'helperpress.json', { cwd: process.cwd(), nocase: true } );

// if no helperpress.json file found, use CWD
if(!projectPath){
	projectPath = process.cwd();
} else {
	// strip filename
	projectPath = projectPath.substring(0, projectPath.lastIndexOf('/')+1);
}

// mapping of HelperPress's Grunt tasks to commands we'll accept
var taskWhitelist = {
	'init': {
		desc: 'Initialize a HelperPress project in the current directory.',
		gruntTask: 'init_project'
	},
	'build [type]': {
		desc: 'Build a full WordPress install in current project.'
	},
	'pull [type] [environment]':{
		desc: 'Pulls down the remote WP data type (db, uploads or both) from specified environment. [both] [_master]'
	},
	'push [type] [environment]':{
		desc: 'Push up the remote WP data type (db, uploads or both) to specified environment. [both] [_master]'
	},
	'deploy': {
		desc: 'Deploy current project.'
	}
};

// Grunt options we will pass on through
// from https://github.com/gruntjs/grunt/blob/master/lib/grunt/cli.js
var gruntOptionsWhitelist = {
	color: {
		info: 'Disable colored output.',
		type: Boolean,
		negate: true
	},
	debug: {
		short: 'd',
		info: 'Enable debugging mode for tasks that support it.',
		type: [Number, Boolean]
	},
	stack: {
		info: 'Print a stack trace when exiting with a warning or fatal error.',
		type: Boolean
	},
	force: {
		short: 'f',
		info: 'A way to force your way past warnings. Want a suggestion? Don\'t use this option, fix your code.',
		type: Boolean
	},
	write: {
		info: 'Disable writing files (dry run).',
		type: Boolean,
		negate: true
	},
	verbose: {
		short: 'v',
		info: 'Verbose mode. A lot more information output.',
		type: Boolean
	}

};

// register the grunt options
for(var opt in gruntOptionsWhitelist){
	
	var optionStr = '--' + opt;

	if(typeof gruntOptionsWhitelist[opt].short === 'string')
		optionStr = '-' + gruntOptionsWhitelist[opt].short + ', ' + optionStr;

	cli.option(optionStr, gruntOptionsWhitelist[opt].info);
}

// Set CLI version
cli.version(pkg.version);

// Set a list of CLI options to pass through to grunt
cli.parseOptions(process.argv);

var gruntOpts = {};
for(var opt in gruntOptionsWhitelist){
	if(typeof cli[opt] !== 'undefined')
		gruntOpts[opt] = cli[opt];
}

// Loop through the task white list and register HP tasks as commands
for(var cmd in taskWhitelist){
	cli
	  .command(cmd)
	  .description(taskWhitelist[cmd].desc)
	  .action(getActionHandler(cmd));
}

// handle commands we haven't defined
cli
  .command('*')
  .action(function(){
    console.log("Command not found.");
    cli.help();
  });

// Parse the CLI input and execute that beast
cli.parse(process.argv);


function getActionHandler(cmd){
	return function(){
	  	var gruntTask = [];

	  	if(typeof taskWhitelist[cmd].gruntTask == 'string')
	  		gruntTask.push(taskWhitelist[cmd].gruntTask);
	  	else{
	  		// loop through args and build grunt string
	  		for(var arg in arguments){
	  			if(typeof arguments[arg] == 'string' ){
	  				gruntTask.push(arguments[arg]);
	  			} else if (typeof arguments[arg] == 'object'){
	  				// unshift the name of the main command
	  				gruntTask.unshift(arguments[arg]._name);
	  			}
	  		}
	  	}

		runGrunt(gruntTask, gruntOpts, projectPath);
	}
}
