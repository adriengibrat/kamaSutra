(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.kamasutra = factory();
}(this, function () { 'use strict';

	/* globals document, getComputedStyle */

	var isRelative = function isRelative(element) {
		return getComputedStyle(element).getPropertyValue('position') === 'relative';
	};
	var isOverflowBox = function isOverflowBox(element) {
		return element === document.body || getComputedStyle(element).getPropertyValue('overflow') !== 'visible';
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

	var containsBox = function containsBox(container, box) {
		return container.top <= box.top && container.right >= box.right && container.bottom >= box.bottom && container.left <= box.left;
	};

	var spaceRegEx = /\s+/;

	var overflowContainer = function overflowContainer(element) {
		return closest(closest(element, isRelative) || element.parentElement, isOverflowBox);
	};

	function kamaSutra() {
		for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
			classNames[_key] = arguments[_key];
		}

		var uniqueClassnames = arrayUnique(classNames.join(' ').split(spaceRegEx));
		var removeClassNamesRegexp = new RegExp('\\s*\\b(?:' + uniqueClassnames.join('|') + ')\\b', 'g');

		return function (element) {
			var container = arguments.length <= 1 || arguments[1] === undefined ? overflowContainer(element) : arguments[1];

			if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
				throw TypeError('first argmument is not a valid DOM element');
			}

			var containerBox = container.getBoundingClientRect();
			var originalClassName = element.className || '';
			var cleanClassName = originalClassName.replace(removeClassNamesRegexp, '');
			var optimalPosition = classNames.some(function (className) {
				element.className = cleanClassName ? cleanClassName + ' ' + className : className;
				return containsBox(containerBox, element.getBoundingClientRect());
			});

			if (!optimalPosition) {
				element.className = originalClassName;
			}
		};
	}

	kamaSutra.overflowContainer = overflowContainer;

	return kamaSutra;

}));