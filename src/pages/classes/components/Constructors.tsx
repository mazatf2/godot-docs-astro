import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'
import {Param, Return_} from './xmlParameters'

import {handleDesc} from './HandleDesc'
import type {constructor_, constructor_param} from '../../../data/class.xsd'
import {Attr} from './Attr'
import {H3} from './H3'
import {fnReturnArrow, space} from './Annotations'
import {sep} from './Methods'

export const Constructors = ({el}: { el: xmlDoc }) => {
	const constructor_ = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as constructor_
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={constructor_.name}><ConstructorsList el={el}/></H3>
		{desc}
	</Fragment>
}

export const ConstructorsList = ({el}: { el: xmlDoc }) => {
	const constructor_ = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as constructor_

	const constructor_param: Required<constructor_param>[] = Param(el)
		.map(i => ({
			index: new Attr('index', i),
			name: new Attr('name', i),
			type: new Attr('type', i),
			enum: new Attr('enum', i),
			default: new Attr('default', i),
		}))

	const constructor_return: Required<constructor_param>[] = Return_(el)
		.map(i => ({
			index: new Attr('index', i),
			name: new Attr('name', i),
			type: new Attr('type', i),
			enum: new Attr('enum', i),
			default: new Attr('default', i),
		}))

	return <Fragment>
		{constructor_.qualifiers && constructor_.qualifiers + space}
		{constructor_.name}
		({constructor_param.map((param, index, arr) => <Fragment>
		{param.name.valid() && param.name}
		{param.type.valid() && ': ' + param.type}
		{param.default.valid() && ' = ' + param.default}
		{param.enum.valid() && ' enum ' + param.enum}
		{sep(', ', index, arr)}
	</Fragment>)})
		{constructor_return.length > 0 && fnReturnArrow}
		{constructor_return.map(return_ => <Fragment>
			{return_.name.valid() && return_.name + space}
			{return_.type.valid() && return_.type + space}
			{return_.enum.valid() && return_.enum + space}
			{return_.default.valid() && return_.default + space}
		</Fragment>)}
	</Fragment>
}
