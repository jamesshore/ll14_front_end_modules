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


	var HtmlElement = global.example.HtmlElement = function HtmlElement(domElement) {
		this._$element = $(domElement);
	};

	HtmlElement.prototype.onMouseDown = function(callback) {
		var $element = this._$element;
		$element.mousedown(function(event) {
			callback(relativeOffset($element, event.pageX, event.pageY));
		});
	};

	HtmlElement.prototype.onMouseMove = function(callback) {
		var $element = this._$element;
		$element.mousemove(function(event) {
			callback(relativeOffset($element, event.pageX, event.pageY));
		});
	};

	HtmlElement.prototype.onMouseUp = function(callback) {
		var $element = this._$element;
		$element.mouseup(function(event) {
			callback(relativeOffset($element, event.pageX, event.pageY));
		});
	};

	function relativeOffset($element, pageX, pageY) {
		var pageOffset = $element.offset();

		return {
			x: pageX - pageOffset.left,
			y: pageY - pageOffset.top
		};
	}


	var SvgCanvas = global.example.SvgCanvas = function(drawingAreaDiv) {
		this._paper = new Raphael(drawingAreaDiv);
	};

	SvgCanvas.prototype.drawLine = function(startX, startY, endX, endY) {
		this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

	SvgCanvas.prototype.lines = function() {
		var result = [];
		this._paper.forEach(function(element) {
			result.push(elementToLine(element));
		});
		return result;
	};

	function elementToLine(element) {
		if (Raphael.svg) return svgPathToLine(element.node.attributes.d.value);
		else if (Raphael.vml) return vmlPathToLine(element.node.path.value);
		else throw new Error("Unknown Raphael engine");
	}

	function svgPathToLine(path) {
		var pathRegex;

		if (path.indexOf(",") !== -1) {
			// Firefox, Safari, and Chrome use format "M20,30L90,60"
			pathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
		}
		else {
			// IE 9 uses format "M 20 30 L 90 60"
			pathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
		}

		var coords = path.match(pathRegex);
		return [
			coords[1],
			coords[2],
			coords[3],
			coords[4]
		];
	}

	function vmlPathToLine(path) {
		// IE 8 uses format "m432000,648000 l1944000,1296000 e"
		var VML_MAGIC_NUMBER = 21600;

		var coords = path.match(/m(\d+),(\d+) l(\d+),(\d+) e/);
		return [
			coords[1] / VML_MAGIC_NUMBER,
			coords[2] / VML_MAGIC_NUMBER,
			coords[3] / VML_MAGIC_NUMBER,
			coords[4] / VML_MAGIC_NUMBER
		];
	}

}(this));
