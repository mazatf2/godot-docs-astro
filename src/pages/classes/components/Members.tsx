import React from 'react'
import type {member} from '../../../data/class.xsd'
import type {xmlDoc} from './xmlParameters'
import {H3} from './H3'
import {handleDesc} from './HandleDesc'
import extensionApiJson2 from '../../../data/extension_api.json'
import type {ExtensionsAPI} from '../../../data/ExtensionsApi'

const extensionApiJson = extensionApiJson2 as ExtensionsAPI

import {Code} from "./Themes.tsx";

export const Members = ({el, className}: { el: xmlDoc, className: string }) => {
	const attrs = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as member
	let desc = handleDesc(el.textContent)

	return <React.Fragment>
		<H3 id={attrs.name}><MembersList el={el} className={className}/></H3>
		{desc}
	</React.Fragment>
}
export const MembersList = ({el, className}: { el: xmlDoc, className: string }) => {
	/*const member: member = Param(el)
		.map(i => ({
			name: new Attr('name', i),
			type: new Attr('type', i),
			setter: new Attr('setter', i),
			getter: new Attr('getter', i),
			overrides: new Attr('overrides', i),
			enum: new Attr('enum', i),
			default: new Attr('default', i),
			is_deprecated: new Attr('is_deprecated', i),
			is_experimental: new Attr('is_experimental', i),
		}))
*/
	const member = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as member
	const enumName = findEnumValue(member, className)

	if (enumName) {
		//Area2D gravity_space_override
		return <Code>var {member.name} = {enumName}</Code>
	}
	return <Code>var {member.name}: {member.type}{member.default && ' = ' + member.default}</Code>
}

function findEnumValue(member: member, className: string) {
	if (!member.enum) {
		return
	}
	let enumParent = member.enum.split('.')[0] || ''
	let enumName = member.enum.split('.')[1] || ''

	if (!enumName) {
		enumParent = className
	}

	let classObj = [
		extensionApiJson.classes.find(i => i.name === enumParent),
		extensionApiJson.builtin_classes.find(i => i.name === enumParent),
		extensionApiJson.global_enums.find(i => i.name === enumName),
	].find(i => i)

	if (!classObj || !classObj.enums) {
		return ''
	}

	const enumObj = classObj.enums.find(i => i.name === enumName)
	if (!enumObj) {
		return ''
	}
	const valueObj = enumObj.values.find(i => i.value.toString() === member.default)
	if (!valueObj) {
		return ''
	}
	return valueObj.name
}