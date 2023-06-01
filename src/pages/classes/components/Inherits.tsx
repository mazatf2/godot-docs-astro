import React, {Fragment} from 'react'
import {get} from '../../../data/inheritance.mjs'
import inheritanceJSON from '../../../data/inheritance.json'

export const Inherits = ({className}: { className: string }) => {
	const inherits = get(className).reverse()
	const isBaseClass = inheritanceJSON[className]?.inherits?.length == 0
	if (inherits.length < 4) {
		let len = 4 - inherits.length
		for (let i = 0; i < len; i += 1) {
			inherits.push(['', ['']])
		}
	}
	const InheritedByDirect = ({str}) => {
		const count = inheritanceJSON[str]?.inheritedBy?.length || ''
		if (!count) return <>{count}</>
		return <>
			{' '}({count})
		</>
	}
	const Label = ({str}) => {
		if (str === 'PhysicsServer3DRenderingServerHandler') {
			return <>PhysicsServer3DRendering<br/>ServerHandler</>
		}
		return <>{str}</>
	}
	return <React.Fragment>
		<div className="columns" style={{whiteSpace: 'nowrap'}}>
			{inherits.map(([parentName, inheritsArr]) => <div className='column'>
				{parentName === className ? <b>{parentName}</b> : <a href={'/classes/' + parentName}>{parentName}</a>}<br/>
				{inheritsArr[0] && <hr/>}
				{inheritsArr.map(className => <>
					{className && <>
						{'- '}
						<a href={'/classes/' + className}>
							<span><Label str={className}/></span>
						</a>
						<span><InheritedByDirect str={className}/></span>
						<br/>
					</>}
				</>)}
			</div>
			)}
		</div>
		{isBaseClass && <Fragment>
			<hr style={{
				width: '30rem',
				height: '0.7rem',
			}}/>
		</Fragment>}
	</React.Fragment>
}