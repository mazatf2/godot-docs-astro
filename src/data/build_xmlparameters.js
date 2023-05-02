const {DOMParser} = require('linkedom')
const {readFile, writeFile} = require("node:fs/promises")

async function build() {
	let out = `//generated file

import type {Attr} from '../pages/classes/components/Attr'
`
	const data = await readFile('../../godot/doc/class.xsd')
	if (!data) throw data
	let xmlStr = data.toString()
	xmlStr = xmlStr.replaceAll('xs:element', 'xs-element')
		.replaceAll('xs:attribute', 'xs-attribute')
		.replaceAll('xs:complexType', 'xs-complexType')
		.replaceAll('xs:sequence', 'xs-sequence')
	const xml = new DOMParser().parseFromString(xmlStr.toString())

	const constants = xml.querySelectorAll('xs-element[name="constants"] xs-element[name="constant"] xs-attribute')
	const members = xml.querySelectorAll('xs-element[name="members"] xs-element[name="member"] xs-attribute')
	const theme_items = xml.querySelectorAll('xs-element[name="theme_item"] xs-attribute')
	const tutorials = xml.querySelectorAll('xs-element[name="tutorials"] xs-element[name="link"] xs-attribute')

	const constructor_ = xml.querySelectorAll('xs-element[name="constructor"] > xs-complexType > xs-attribute')
	const constructor_return = xml.querySelectorAll('xs-element[name="constructor"] xs-element[name="return"] xs-attribute')
	const constructor_param = xml.querySelectorAll('xs-element[name="constructor"] xs-element[name="param"] xs-attribute')
	const method = xml.querySelectorAll('xs-element[name="method"] > xs-complexType > xs-attribute')
	const method_return = xml.querySelectorAll('xs-element[name="method"] xs-element[name="return"] xs-attribute')
	const method_returns_error = xml.querySelectorAll('xs-element[name="method"] xs-element[name="returns_error"] xs-attribute')
	const method_param = xml.querySelectorAll('xs-element[name="method"] xs-element[name="param"] xs-attribute')
	const signal = xml.querySelectorAll('xs-element[name="signal"] > xs-complexType > xs-attribute')
	const signal_param = xml.querySelectorAll('xs-element[name="signal"] xs-element[name="param"] xs-attribute')
	const annotation = xml.querySelectorAll('xs-element[name="annotation"] > xs-complexType > xs-attribute')
	const annotation_return = xml.querySelectorAll('xs-element[name="annotation"] xs-element[name="return"] xs-attribute')
	const annotation_param = xml.querySelectorAll('xs-element[name="annotation"] xs-element[name="param"] xs-attribute')
	const operator = xml.querySelectorAll('xs-element[name="operator"] > xs-complexType > xs-attribute')
	const operator_return = xml.querySelectorAll('xs-element[name="operator"] xs-element[name="return"] xs-attribute')
	const operator_param = xml.querySelectorAll('xs-element[name="operator"] xs-element[name="param"] xs-attribute')

	out += typeNameUse('constant', constants)
	out += typeNameUse('member', members)
	out += typeNameUse('theme_item', theme_items)
	out += typeNameUse('tutorial', tutorials)

	out += typeNameUse('constructor_', constructor_)
	out += typeNameUse('constructor_return', constructor_return)
	out += typeNameUse('constructor_param', constructor_param)
	out += typeNameUse('method', method)
	out += typeNameUse('method_return', method_return)
	out += typeNameUse('method_returns_error', method_returns_error)
	out += typeNameUse('method_param', method_param)
	out += typeNameUse('signal', signal)
	out += typeNameUse('signal_param', signal_param)
	out += typeNameUse('annotation', annotation)
	out += typeNameUse('annotation_return', annotation_return)
	out += typeNameUse('annotation_param', annotation_param)
	out += typeNameUse('operator', operator)
	out += typeNameUse('operator_return', operator_return)
	out += typeNameUse('operator_param', operator_param)

	await writeFile('./class.xsd.d.ts', out)
}

build()

/**
 * @param {string} name
 * @param {*} i
 */
function typeNameUse(name, i) {
	return `
export type ${name} = {
	${i.map(i => {
		const memberName = i.getAttribute('name')
		const optional = i.getAttribute('use') === 'optional' ? '?' : ''
		const type = i.getAttribute('type')//.split(':')[1]
		return `\t${memberName}${optional}: Attr
`
	}).join('').trim()}
}`
}