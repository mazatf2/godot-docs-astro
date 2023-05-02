import React, {Fragment} from 'react'
import type {xmlDoc} from './xmlParameters'

import {handleDesc} from './HandleDesc'

export const Tutorials = ({el}: { el: xmlDoc }) => {
	const desc = handleDesc(el.textContent)
	return <Fragment>
	</Fragment>
}

export const TutorialsList = ({el}: { el: xmlDoc }) => {
	return <Fragment>
	</Fragment>
}
