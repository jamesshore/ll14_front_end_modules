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

	var fs = require("fs");
	var shell = require("shelljs");
	var browserify = require("browserify");

	var lint = require("./build/util/lint_runner.js");
	var karma = require("./build/util/karma_runner.js");

	var GENERATED_DIR = "generated";
	var VENDOR_BUILD_DIR = GENERATED_DIR + "/vendor";
	var COMMONJS_BUILD_DIR = GENERATED_DIR + "/commonjs";

	directory(VENDOR_BUILD_DIR);
	directory(COMMONJS_BUILD_DIR);

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
		var passed = lint.validateFileList(browserFilesToLint(), browserLintOptions(), browserGlobals());
		if (!passed) fail("Lint failed");
	});

	desc("Test browser code");
	task("test", ["build"], function() {
		karma.runTests(REQUIRED_BROWSERS, complete, fail);
	}, {async: true});

	desc("Build all examples");
	task("build", ["commonjs"]);

	desc("Build CommonJS example");
	task("commonjs", [COMMONJS_BUILD_DIR, "vendor"], function() {
		shell.rm("-rf", COMMONJS_BUILD_DIR + "/*");
		shell.cp("-R", "src/commonjs/*.html", COMMONJS_BUILD_DIR);

		console.log("Bundling CommonJS files with Browserify...");
		var b = browserify();
		b.require("./src/commonjs/drawing_area.js", {expose: "./drawing_area.js"} );
		b.bundle({ debug: true }, function(err, bundle) {
			if (err) fail(err);
			fs.writeFileSync(COMMONJS_BUILD_DIR + "/bundle.js", bundle);
			complete();
		});
	}, {async: true});

	desc("Build vendor files");
	task("vendor", [VENDOR_BUILD_DIR], function() {
		shell.rm("-rf", VENDOR_BUILD_DIR + "/*");
		shell.cp("-R", "src/vendor/*", VENDOR_BUILD_DIR);
	});

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

	function browserGlobals() {
		return {
			// CommonJS
			require: false,
			module: false,
			exports: false,

			// Mocha / expect.js
			mocha: false,
			describe: false,
			it: false,
			expect: false,
			dump: false,
			beforeEach: false,
			afterEach: false
		};
	}

}());