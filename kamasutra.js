(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.kamasutra = factory();
}(this, function () { 'use strict';

	var styleProperty = function styleProperty(element, property) {
		return window.getComputedStyle(element, null).getPropertyValue(property);
	};
	var isRelative = function isRelative(element) {
		return styleProperty(element, 'position') === 'relative';
	};
	var isOverflowBox = function isOverflowBox(element) {
		return styleProperty(element, 'overflow') !== 'visible' || element === document.body;
	};
	var closest = function closest(element, predicate) {
		while (element && !predicate(element)) {
			element = element.parentElement;
		}

		return element;
	};
	var containsBox = function containsBox(container, box) {
		return container.top <= box.top && container.right >= box.right && container.bottom >= box.bottom && container.left <= box.left;
	};
	var index = (function () {
		for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
			classNames[_key] = arguments[_key];
		}

		var removeClassNamesRegexp = new RegExp('(?:\\s*\\b' + classNames.join(' ').split(' ').join('\\b\\s*)|(?:\\s*\\b') + '\\b\\s*)', 'g');

		return function (element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
				return; // wtf, not a valid element
			}

			var origin = closest(element, isRelative);
			if (!origin) {
				return; // element is out of flow
			}

			var container = closest(origin, isOverflowBox).getBoundingClientRect();
			var originalClassName = element.className || '';
			var cleanClassName = originalClassName.replace(removeClassNamesRegexp, ' ').trim();
			classNames.some(function (className) {
				element.className = cleanClassName + ' ' + className;

				return containsBox(container, element.getBoundingClientRect());
			}) || (element.className = originalClassName);
		};
	})

	return index;

}));