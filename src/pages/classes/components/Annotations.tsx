import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'
import {Param, Return_} from './xmlParameters'
import {Attr} from './Attr'
import type {annotation, annotation_param, annotation_return} from '../../../data/class.xsd'
import {H3} from './H3'
import {handleDesc} from './HandleDesc'
import {sep, sepLast} from './Methods'

export const space: ' ' = ' '
export const returnTypeArrow: ' -> ' = ' -> '
export const fnReturnArrow = returnTypeArrow
export const ReturnArrow = returnTypeArrow
export const Annotations = ({el}: { el: xmlDoc }) => {
	const attrs = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as annotation
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={attrs.name}><AnnotationsList el={el}/></H3>
		{desc}
	</Fragment>
}

export const AnnotationsList = ({el}: { el: xmlDoc }) => {
	const annotation = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as annotation

	const annotation_param: Required<annotation_param>[] = Param(el)
		.map(i => ({
			index: new Attr('index', i),
			name: new Attr('name', i),
			type: new Attr('type', i),
			enum: new Attr('enum', i), //
			default: new Attr('default', i),
		}))

	const annotation_return: Required<annotation_return>[] = Return_(el)
		.map(i => ({
			type: new Attr('type', i),
			enum: new Attr('enum', i),
		}))

	if (annotation_param.length === 0) {
		return <Fragment>
			{annotation.qualifiers && annotation.qualifiers + space}
			{annotation.name}
			{annotation_return.length > 0 && fnReturnArrow}
			{annotation_return.map(return_ => <Fragment>
				{return_.enum.valid() && return_.enum + space}
				{return_.type.valid() && return_.type + space}
			</Fragment>)}
		</Fragment>
	}

	const varArg = annotation.qualifiers?.toString() === 'vararg'
	return <Fragment>
		{annotation.qualifiers && annotation.qualifiers + space}
		{annotation.name}
		(
		{annotation_param.map((param, index, arr) => <Fragment>
			{param.name.valid() && param.name}
			{param.type.valid() && ': ' + param.type}
			{param.default.valid() && ' = ' + param.default}
			{param.enum.valid() && ' enum ' + param.enum}
			{sep(', ', index, arr)}
			{varArg && sepLast(', ...', index, arr)}
		</Fragment>)}
		)
		{annotation_return.length > 0 && fnReturnArrow}
		{annotation_return.map(return_ => <Fragment>
			{return_.enum.valid() && return_.enum + space}
			{return_.type.valid() && return_.type + space}
		</Fragment>)}

	</Fragment>
}
