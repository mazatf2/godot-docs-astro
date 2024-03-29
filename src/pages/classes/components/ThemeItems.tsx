import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'

import {handleDesc} from './HandleDesc'
import type {theme_item} from '../../../data/class.xsd'
import {H3} from './H3'
import type {Attr} from './Attr'
import {Code} from "./Themes.tsx";

export const ThemeItems = ({el}: { el: xmlDoc }) => {
	const theme_item = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as theme_item
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={theme_item.name}><ThemeItemsList el={el}/></H3>
		{desc}
	</Fragment>
}

export const ThemeItemsList = ({el}: { el: xmlDoc }) => {
	const theme_item = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as theme_item
	//bug: single quotes are rendered as &#39; so we are using unicode lookalike
	//"'" => "ꞌ" Latin Small Letter Saltillo
	return <Code>
		self[ꞌ{setterToVar(theme_item.data_type)}/{theme_item.name}ꞌ] = {theme_item.default || theme_item.data_type} as {theme_item.type}
	</Code>
}

function setterToVar(dataType: Attr) {
	switch (dataType.toString()) {
		case 'color':
			return 'theme_override_colors'
		case 'constant':
			return 'theme_override_constants'
		case 'font':
			return 'theme_override_fonts'
		case 'font_size':
			return 'theme_override_font_sizes'
		case 'icon':
			return 'theme_override_icons'
		case 'style':
			return 'theme_override_styles'
	}
}