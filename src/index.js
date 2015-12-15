let styleProperty =  (element, property) => window.getComputedStyle(element, null).getPropertyValue(property),
	isRelative = (element) => styleProperty(element, 'position') === 'relative',
	isOverflowBox = (element) => styleProperty(element, 'overflow') !== 'visible' || element === document.body,
	closest = (element, predicate) => {
		while (element && !predicate(element)) {
			element = element.parentElement
		}

		return element
	},
	arrayUnique = ((predicate) => (array) => array.filter(predicate))((value, index, array) => array.indexOf(value, index + 1) < 0),
	spaceRegEx = /\s+/,
	getContainer = (element) => closest(closest(element, isRelative) || element.parentElement, isOverflowBox),
	containsBox = (container, box) =>
		container.top <= box.top &&
		container.right >= box.right &&
		container.bottom >= box.bottom &&
		container.left <= box.left,
	area = (box) => (box.width) * (box.height),
	coverBox = (container, box) => area({
			height: Math.min(container.bottom, box.bottom) - Math.max(container.top, box.top),
			width: Math.min(container.right, box.right) - Math.max(container.left, box.left)
		}) / area(box)

export default (classNames, constraint = containsBox) => {
	let removeClassNamesRegexp = new RegExp(
		`\\s*\\b(?:${arrayUnique(classNames.join(' ').split(spaceRegEx)).join('|')})\\b`,
		'g'
	)

	return (element, container = getContainer(element)) => {
		if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
			return // wtf, not a valid element
		}

		let containerBox = container.getBoundingClientRect()
		let originalClassName = element.className || ''
		let cleanClassName = originalClassName.replace(removeClassNamesRegexp, '')
		classNames
			.some((className) => {
				element.className = cleanClassName && `${cleanClassName} ${className}` || className
				//console.log(coverBox(containerBox, element.getBoundingClientRect()))
				return constraint(containerBox, element.getBoundingClientRect())
			}) || (element.className = originalClassName)

		return element
	}
}