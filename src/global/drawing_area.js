// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*globals example:true, Raphael, $ */

(function(global) {
	"use strict";

	global.example = global.example || {};
	var exports = global.example.drawingArea = {};

	var paper;

	exports.initialize = function(drawingAreaDiv) {
		paper = new Raphael(drawingAreaDiv);
		handleDragEvents(drawingAreaDiv);
		return paper;
	};

	function handleDragEvents(drawingAreaDiv) {
		var $drawingArea = $(drawingAreaDiv);

		var start = null;

		$drawingArea.mousedown(function(event) {
			var offset = relativeOffset($drawingArea, event.pageX, event.pageY);
			start = offset;
		});

		$drawingArea.mousemove(function(event) {
			if (start === null) return;

			var end = relativeOffset($drawingArea, event.pageX, event.pageY);
			drawLine(start.x, start.y, end.x, end.y);
			start = end;
		});

		$drawingArea.mouseup(function(event) {
			start = null;
		});
	}

	var drawLine = example.drawLine = function(startX, startY, endX, endY) {
		paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

	function relativeOffset(element, pageX, pageY) {
		var pageOffset = element.offset();

		return {
			x: pageX - pageOffset.left,
			y: pageY - pageOffset.top
		};
	}

}(this));
