/* globals getComputedStyle */

export const isRelative = (element) => getComputedStyle(element).getPropertyValue('position') === 'relative'
export const isOverflowBox = (element) => element === document.body || getComputedStyle(element).getPropertyValue('overflow') !== 'visible'

export const closest = (element, predicate) => {
	while (element && !predicate(element)) { element = element.parentElement }
	return element
}

export const arrayUnique = ((predicate) => (array) => array.filter(predicate))((value, index, array) => array.indexOf(value, index + 1) < 0)

export const containsBox = (container, box) => container.top <= box.top && container.right >= box.right && container.bottom >= box.bottom && container.left <= box.left
