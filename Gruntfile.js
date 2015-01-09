'use strict';
module.exports = function (grunt) {
	require('smartload-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});

	grunt.initConfig({
		release: {}
	});
};
