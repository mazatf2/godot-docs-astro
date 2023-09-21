import {Param, Return_, Returns_error, xmlDoc} from './xmlParameters'
import React, {Fragment} from 'react'
import type {method, method_param, method_return, method_returns_error} from '../../../data/class.xsd'
import {Attr} from './Attr'
import {H3} from './H3'
import {handleDesc} from './HandleDesc'
import {fnReturnArrow, space} from './Annotations'
import {Code} from './Themes.tsx'

export const sep = (sep: string, index: number, arr: any[]) => {
	if (index !== arr.length - 1) {
		return sep
	}
	return ''
}
export const sepLast = (sep: string, index: number, arr: any[]) => {
	if (index === arr.length - 1) {
		return sep
	}
	return ''
}
export const Methods = ({el}: { el: xmlDoc }) => {
	const attrs = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as method
	const desc = handleDesc(el.textContent)

	if (!attrs.name) {
		throw attrs.name
	}

	return <div>
		<H3 id={attrs.name}><MethodsList el={el}/></H3>
		{desc}
	</div>
}

export const MethodsList = ({el}: { el: xmlDoc }) => {
	const method = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as method

	const method_param: Required<method_param>[] = Param(el)
		.map(i => ({
			index: new Attr('index', i), name: new Attr('name', i), type: new Attr('type', i), enum: new Attr('enum', i), default: new Attr('default', i),
		}))

	const method_return: Required<method_return>[] = Return_(el)
		.map(i => ({
			type: new Attr('type', i), enum: new Attr('enum', i),
		}))

	//used only in 1 file: https://github.com/godotengine/godot/blob/4.0.2-stable/doc/classes/ConfigFile.xml#L161
	const method_returns_error: Required<method_returns_error>[] = Returns_error(el)
		.map(i => ({
			number: new Attr('number', i),
		}))
	if (method_return.length > 1) {
		console.log(method_return + 'method_return')
	}

	return <Code>
		{maybe(method.qualifiers)}func {method.name}(
		{method_param.map((i, index, arr) => <Fragment>
			{i.name}: {i.type}{i.default.valid() && ' = ' + i.default}{i.enum.valid() && ' enum' + i.enum}{sep(', ', index, arr)}
		</Fragment>)})
		{method_return.length > 0 && fnReturnArrow}
		{method_return.map((i, index, arr) => <Fragment>
			{i.type.valid() && i.type + sep(space, index, arr)}
			{i.enum.valid() && i.enum + sep(space, index, arr)}
			{sep(' | ', index, arr)}
		</Fragment>)}
	</Code>
}

function maybe(str) {
	if (!str) {
		return ''
	}
	return str + ' '
}