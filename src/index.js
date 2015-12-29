import {isRelative, isOverflowBox, closest, arrayUnique, containsBox} from './utils'

let spaceRegEx = /\s+/

let overflowContainer = (element) => closest(closest(element, isRelative) || element.parentElement, isOverflowBox)
let applyClasses = (element, ...classNames) => {
	let uniqueClassnames = arrayUnique(classNames.join(' ').split(spaceRegEx)).filter(Boolean)
	let removeClassNamesRegexp = new RegExp(`\\s*\\b(?:${uniqueClassnames.join('|')})\\b`, 'g')
	let originalClassName = element.className || ''
	let cleanClassName = originalClassName.replace(removeClassNamesRegexp, '')
	let actions = classNames.map((className) => () => element.className = `${className} ${cleanClassName}`)
	actions.push(() => element.className = originalClassName)
	return actions
}

export default function kamaSutra (element, ...actions) {
	return (element, container = overflowContainer(element)) => {
		if (!element || element.nodeType !== Node.ELEMENT_NODE || !element.parentElement) {
			throw TypeError('first argmument is not a valid DOM element')
		}

		let containerBox = container.getBoundingClientRect()
		return actions
			.some((action) => {
				action()
				return containsBox(containerBox, element.getBoundingClientRect())
			})
	}
}

kamaSutra.overflowContainer = overflowContainer
kamaSutra.applyClasses = applyClasses
