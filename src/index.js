import {isRelative, isOverflowBox, closest, arrayUnique, containsBox} from './utils'

let spaceRegEx = /\s+/

let overflowContainer = (element) => closest(closest(element, isRelative) || element.parentElement, isOverflowBox)

export default (classNames, constraint = containsBox) => {
	let removeClassNamesRegexp = new RegExp(
		`\\s*\\b(?:${arrayUnique(classNames.join(' ').split(spaceRegEx)).join('|')})\\b`,
		'g'
	)

	return (element, container = overflowContainer(element)) => {
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