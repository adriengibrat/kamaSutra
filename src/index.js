let styleProperty =  (element, property) => window.getComputedStyle(element, null).getPropertyValue(property),
	isRelative = (element) => styleProperty(element, 'position') === 'relative',
	isOverflowBox = (element) => styleProperty(element, 'overflow') !== 'visible' || element === document.body,
	closest = (element, predicate) => {
		while (element && !predicate(element)) {
			element = element.parentElement
		}

		return element
	},
	containsBox = (container, box) =>
		container.top <= box.top &&
		container.right >= box.right &&
		container.bottom >= box.bottom &&
		container.left <= box.left

export default (...classNames) => {
	let removeClassNamesRegexp = new RegExp(
		`(?:\\s*\\b${classNames.join(' ').split(' ').join('\\b\\s*)|(?:\\s*\\b')}\\b\\s*)`,
		'g'
	)

	return (element) => {
		if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
			return // wtf, not a valid element
		}

		let origin = closest(element, isRelative)
		if (!origin) {
			return // element is out of flow
		}

		let container = closest(origin, isOverflowBox).getBoundingClientRect()
		let originalClassName = element.className || ''
		let cleanClassName = originalClassName.replace(removeClassNamesRegexp, ' ').trim()
		classNames
			.some((className) => {
				element.className = `${cleanClassName} ${className}`

				return containsBox(container, element.getBoundingClientRect())
			}) || (element.className = originalClassName)
	}
}