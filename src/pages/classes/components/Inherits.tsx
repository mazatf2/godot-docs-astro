import React, {Fragment} from 'react'
import {get} from '../../../data/inheritance.mjs'

export const Inherits = ({className}: { className: string }) => {
	const inherits = get(className)
	return <React.Fragment>
		<table>
			<tr>
				{inherits.map(([parentName]) => <td key={parentName}>
					{parentName === className ? <b>{parentName}</b> : <a href={'/classes/' + parentName}>{parentName}</a>}
				</td>)}
			</tr>
			<tr>
				{inherits.map(([parentName, inheritsArr]) => <Fragment key={parentName}>
					<td>
						{inheritsArr.map(className => <li>
							<a href={'/classes/' + className}>{className}</a>
						</li>)}
					</td>
				</Fragment>)}
			</tr>
		</table>
	</React.Fragment>
}