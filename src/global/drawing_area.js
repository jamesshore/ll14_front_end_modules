// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
(function(global) {
	"use strict";

	global.example = global.example || {};
	var exports = global.example.drawingArea = {};

	var HtmlElement = global.example.HtmlElement;
	var SvgCanvas = global.example.SvgCanvas;

	exports.initialize = function(drawingAreaDiv) {
		var drawingArea = new HtmlElement(drawingAreaDiv);
		var canvas = new SvgCanvas(drawingAreaDiv);

		handleDragEvents(drawingArea, canvas);
		return canvas;
	};

	function handleDragEvents(drawingArea, canvas) {
		var start = null;

		drawingArea.onMouseDown(function(offset) {
			start = offset;
		});

		drawingArea.onMouseMove(function(offset) {
			if (start === null) return;
			canvas.drawLine(start.x, start.y, offset.x, offset.y);
			start = offset;
		});

		drawingArea.onMouseUp(function(offset) {
			start = null;
		});
	}

}(this));
