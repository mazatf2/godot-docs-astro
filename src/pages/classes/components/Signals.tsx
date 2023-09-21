import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'
import {Param} from './xmlParameters'

import {handleDesc} from './HandleDesc'
import type {signal, signal_param} from '../../../data/class.xsd'
import {H3} from './H3'
import {Attr} from './Attr'
import {sep} from './Methods'
import {Code} from "./Themes.tsx";

export const Signals = ({el}: { el: xmlDoc }) => {
	const signal = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as signal
	const desc = handleDesc(el.textContent)
	return <Fragment>
		<H3 id={signal.name}><SignalsList el={el}/></H3>
		{desc}
	</Fragment>
}

export const SignalsList = ({el}: { el: xmlDoc }) => {
	const signal = Object.fromEntries(el.attributes
		.map(i => [i.name, i.value])) as signal

	const signal_param: Required<signal_param>[] = Param(el)
		.map(i => ({
			index: new Attr('index', i),
			name: new Attr('name', i),
			type: new Attr('type', i),
		}))
	return <Code>
		signal {signal.name}
		(
		{signal_param.map((signal, index, arr) => <Fragment>
			{signal.name.valid() && signal.name}
			{signal.type.valid() && ': ' + signal.type}
			{sep(', ', index, arr)}
		</Fragment>)}
		)
	</Code>
}
