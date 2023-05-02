import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'

import {handleDesc} from './HandleDesc'

//these are constants
export const Enums = ({el}: { el: xmlDoc }) => {
	const desc = handleDesc(el.textContent)
	return <Fragment>
	</Fragment>
}

export const EnumsList = ({el}: { el: xmlDoc }) => {
	return <Fragment>
	</Fragment>
}
