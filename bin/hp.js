#!/usr/bin/env node


var cli = require('commander'),
	findup = require('findup-sync'),

	pkg = require('../package.json'),
	runGrunt = require('../libs/grunt.js');

// determine current HP project path
var projectPath = findup( 'helperpress.json', { cwd: process.cwd(), nocase: true } );

// if no helperpress.json file found, use CWD
if(!projectPath)
	projectPath = process.cwd();

// mapping of HelperPress's Grunt tasks to commands we'll accept
var taskWhitelist = {
	'init': {
		desc: 'Initialize a HelperPress project in the current directory.',
		gruntTask: 'init_project'
	},
	'build': {
		desc: 'Build a full WordPress install in current project.',
		gruntTask: 'build_dist',
		subTask: {
			'dev': 'build_dev',
			'dist': 'build_dist'
		}
	},
	'migrate': {
		desc: 'Migrate uploads or the WP database.',
		gruntTask: 'migrate',
		subTask: {
			'uploads': 'migrate_uploads',
			'db': 'migrate_db'
		}
	},
	'deploy': {
		desc: 'Deploy current project.',
		gruntTask: 'deploy'
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

// Loop through the task white list and register commands
for(var cmd in taskWhitelist){

	var cmdStr = cmd;

	if(typeof taskWhitelist[cmd].subTask !== 'undefined')
		cmdStr += ' [' + Object.keys(taskWhitelist[cmd].subTask).join('|') + ']';

	cli
	  .command(cmdStr)
	  .description(taskWhitelist[cmd].desc)
	  // .action(handleCommand);
}

cli.parse(process.argv);

