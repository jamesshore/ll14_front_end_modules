// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global desc, task, jake, fail, complete, directory, require, console, process */
(function () {
	"use strict";

	var REQUIRED_BROWSERS = [
		"IE 8.0 (Windows)",
		"IE 9.0 (Windows)",
		"Firefox 22.0 (Mac)",
		"Chrome 28.0 (Mac)",
		"Safari 6.0 (Mac)",
		"Safari 6.0 (iOS)"
	];

	var lint = require("./build/util/lint_runner.js");
	var karma = require("./build/util/karma_runner.js");

	desc("Lint and test");
	task("default", ["lint", "test"], function() {
		console.log("\n\nOK");
	});

	desc("Start Karma server -- run this first");
	task("karma", function() {
		karma.serve(complete, fail);
	}, {async: true});

	desc("Lint everything");
	task("lint", [], function () {
		var passed = lint.validateFileList(browserFilesToLint(), browserLintOptions(), {});
		if (!passed) fail("Lint failed");
	});

	desc("Test browser code");
	task("test", function() {
		karma.runTests(REQUIRED_BROWSERS, complete, fail);
	}, {async: true});

	function browserFilesToLint() {
		var files = new jake.FileList();
		files.include("src/global/*.js");
		files.include("src/commonjs/*.js");
		files.include("src/amd/*.js");
		files.include("src/es6/*.js");
		return files.toArray();
	}

	function globalLintOptions() {
		return {
			bitwise:true,
			curly:false,
			eqeqeq:true,
			forin:true,
			immed:true,
			latedef:false,
			newcap:true,
			noarg:true,
			noempty:true,
			nonew:true,
			regexp:true,
			undef:true,
			strict:true,
			trailing:true
		};
	}

	function browserLintOptions() {
		var options = globalLintOptions();
		options.browser = true;
		return options;
	}

}());