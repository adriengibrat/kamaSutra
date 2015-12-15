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
	var arrayUnique = (function (predicate) {
		return function (array) {
			return array.filter(predicate);
		};
	})(function (value, index, array) {
		return array.indexOf(value, index + 1) < 0;
	});
	var spaceRegEx = /\s+/;
	var getContainer = function getContainer(element) {
		return closest(closest(element, isRelative) || element.parentElement, isOverflowBox);
	};
	var containsBox = function containsBox(container, box) {
		return container.top <= box.top && container.right >= box.right && container.bottom >= box.bottom && container.left <= box.left;
	};
	var index = (function (classNames) {
		var constraint = arguments.length <= 1 || arguments[1] === undefined ? containsBox : arguments[1];

		var removeClassNamesRegexp = new RegExp('\\s*\\b(?:' + arrayUnique(classNames.join(' ').split(spaceRegEx)).join('|') + ')\\b', 'g');

		return function (element) {
			var container = arguments.length <= 1 || arguments[1] === undefined ? getContainer(element) : arguments[1];

			if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
				return; // wtf, not a valid element
			}

			var containerBox = container.getBoundingClientRect();
			var originalClassName = element.className || '';
			var cleanClassName = originalClassName.replace(removeClassNamesRegexp, '');
			classNames.some(function (className) {
				element.className = cleanClassName && cleanClassName + ' ' + className || className;
				//console.log(coverBox(containerBox, element.getBoundingClientRect()))
				return constraint(containerBox, element.getBoundingClientRect());
			}) || (element.className = originalClassName);

			return element;
		};
	})

	return index;

}));