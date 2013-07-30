// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*globals Raphael */

(function(global) {
	"use strict";

	global.example = global.example || {};
	var exports = global.example.drawingArea = {};

	var HtmlElement = global.example.HtmlElement;

	var paper;

	exports.initialize = function(drawingAreaDiv) {
		var drawingArea = new HtmlElement(drawingAreaDiv);
		paper = new Raphael(drawingAreaDiv);
		handleDragEvents(drawingArea);
		return paper;
	};

	function handleDragEvents(drawingArea) {
		var start = null;

		drawingArea.onMouseDown(function(offset) {
			start = offset;
		});

		drawingArea.onMouseMove(function(offset) {
			if (start === null) return;
			drawLine(start.x, start.y, offset.x, offset.y);
			start = offset;
		});

		drawingArea.onMouseUp(function(offset) {
			start = null;
		});
	}

	var drawLine = global.example.drawLine = function(startX, startY, endX, endY) {
		paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

}(this));
