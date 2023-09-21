import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'
import {handleDesc} from './HandleDesc'
import type {constant} from '../../../data/class.xsd'
import {BitfieldTag, DeprecatedTag, ExperimentalTag} from './TagLabels/TagLabels'
import {H3} from './H3'
import {Code} from "./Themes.tsx";

export const Constants = ({el}: { el: xmlDoc }) => {
	const attrs = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as constant
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={attrs.name}><ConstantsList el={el}/></H3>
		{desc}
	</Fragment>
}

export const ConstantsList = ({el}: { el: xmlDoc }) => {
	const attrs = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as constant

	const tagsGroup = [attrs.is_bitfield && <BitfieldTag/>,
		attrs.is_deprecated && <DeprecatedTag/>,
		attrs.is_experimental && <ExperimentalTag/>].filter(i => i)

	//for @GlobalScope, @GDScript
	if (attrs.enum) {
		return <Fragment>
			<Code>
				const{' '}
				{attrs.name}{' = ' + attrs.value}
				{attrs.enum && ' enum ' + attrs.enum}
			</Code>
			{tagsGroup.length > 0 && tagsGroup}
		</Fragment>
	}

	return <Fragment>
		<Code>
			<>const </>
			{attrs.name}{' = ' + attrs.value}
			{attrs.enum && ' enum ' + attrs.enum}
		</Code>
		{tagsGroup.length > 0 && tagsGroup}
	</Fragment>
}
