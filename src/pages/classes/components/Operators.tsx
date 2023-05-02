import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'
import {Param, Return_} from './xmlParameters'
import {handleDesc} from './HandleDesc'
import {H3} from './H3'
import type {operator, operator_param, operator_return} from '../../../data/class.xsd'
import {Attr} from './Attr'
import {ReturnArrow} from './Annotations'

export const Operators = ({el, className}: { el: xmlDoc, className: string }) => {
	const operator = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as operator
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={operator.name}>{<OperatorsList el={el} className={className}/>}</H3>
		{desc}
	</Fragment>
}

export const OperatorsList = ({el, className}: { el: xmlDoc, className: string }) => {
	const operator = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as operator

	const operator_param: Required<operator_param>[] = Param(el)
		.map(i => ({
			index: new Attr('index', i),
			name: new Attr('name', i),
			type: new Attr('type', i),
			enum: new Attr('enum', i),
			default: new Attr('default', i),
		}))

	const operator_return: Required<operator_return>[] = Return_(el)
		.map(i => ({
			type: new Attr('type', i),
			enum: new Attr('enum', i),
		}))

	return <Fragment>
		<RenderOperator operator={operator} operator_param={operator_param} operator_return={operator_return} className={className}/>
	</Fragment>
}

const RenderOperator = ({operator, operator_param, operator_return, className}: { operator: operator, operator_param: operator_param[], operator_return: operator_return[], className: string }) => {
	if (!operator.name) return <Fragment></Fragment>

	const name = operator.name.toString()
	const paramType = operator_param[0]?.type.toString() || ''
	const returnType = operator_return[0]?.type.toString() || ''

	const operatorName = name.split(' ')[1]
	if (!operatorName) return <Fragment></Fragment>
	if (operatorName === 'unary-') {
		return <Fragment>
			-{className} {ReturnArrow} {returnType}
		</Fragment>
	}
	if (operatorName === 'unary+') {
		return <Fragment>
			+{className} {ReturnArrow} {returnType}
		</Fragment>
	}
	if (operatorName === '[]') {
		return <Fragment>
			{className}[{paramType}] {ReturnArrow} {returnType}
		</Fragment>
	}
	return <Fragment>
		{className} {operatorName} {paramType} {ReturnArrow} {returnType}
	</Fragment>
}