import {isRelative, isOverflowBox, closest, arrayUnique, containsBox} from './utils'

let spaceRegEx = /\s+/

let overflowContainer = (element) => closest(closest(element, isRelative) || element.parentElement, isOverflowBox)

export default function kamaSutra (...classNames) {
	let uniqueClassnames = arrayUnique(classNames.join(' ').split(spaceRegEx))
	let removeClassNamesRegexp = new RegExp(`\\s*\\b(?:${uniqueClassnames.join('|')})\\b`, 'g')

	return (element, container = overflowContainer(element)) => {
		if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
			return // wtf, not a valid element
		}

		let containerBox = container.getBoundingClientRect()
		let originalClassName = element.className || ''
		let cleanClassName = originalClassName.replace(removeClassNamesRegexp, '')
		let optimalPosition = classNames
			.some((className) => {
				element.className = cleanClassName ? `${cleanClassName} ${className}` : className
				return containsBox(containerBox, element.getBoundingClientRect())
			})

		if (!optimalPosition) {
			element.className = originalClassName
		}
	}
}

kamaSutra.overflowContainer = overflowContainer
