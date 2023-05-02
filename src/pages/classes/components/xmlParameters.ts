import {readFile} from 'node:fs/promises'
// @ts-ignore
import {DOMParser} from 'linkedom'

export type xmlDoc = typeof XMLDocument

export type xmlParameters = {
	brief_description: string
	description: string
	members: XMLDocument[]
	methods: Element[]
	signals: Element[]
	constants: XMLDocument[]
	theme_items: Element[]
	tutorials: Element[]
	constructors: Element[]
	annotations: Element[]
	operators: Element[]
	Return_: (el: Element) => Element[]
	Returns_error: (el: Element) => Element[]
	Param: (el: Element) => Element[]
}
export const Return_ = (el: Element) => el.querySelectorAll('return') as Element[]
export const Returns_error = (el: Element) => el.querySelectorAll('returns_error') as Element[]
export const Param = (el: Element) => el.querySelectorAll('param') as Element[]

export async function xmlParameters(xmlPath: string): Promise<xmlParameters> {
	let xml = (await readFile(xmlPath, 'utf8'))
		.replaceAll('\t', '')
		//.replaceAll('    ', '\t')

	const t = new DOMParser().parseFromString(xml, 'text/xml')

	const brief_description = t.querySelector('class brief_description')?.textContent || 'aa'
	const description = t.querySelector('class description')?.textContent || 'aa'
	const members: xmlDoc = t.querySelectorAll('class member')
	const methods = t.querySelectorAll('class method')
	const signals = t.querySelectorAll('class signal')
	const constants: xmlDoc = t.querySelectorAll('class constant')
	const theme_items = t.querySelectorAll('class theme_item')
	const tutorials = t.querySelectorAll('class tutorial')
	const constructors = t.querySelectorAll('class constructor')
	const annotations = t.querySelectorAll('class annotation')
	const operators = t.querySelectorAll('class operator')

	//const constructor_return
	//const constructor_param
	//const method_return
	//const method_returns_error
	//const method_param
	//const annotation_return
	//const annotation_param
	//const operator_return
	//const operator_param

	const out: xmlParameters = {
		brief_description,
		description,
		members,
		methods,
		signals,
		constants,
		theme_items,
		tutorials,
		constructors,
		annotations,
		operators,
		Return_,
		Returns_error,
		Param,
	}
	return out
}