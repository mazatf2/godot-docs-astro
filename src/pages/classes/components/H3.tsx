import React from 'react'
import './H3.css'

export const H3 = ({children, id}: { children: React.ReactNode, id: string }) => {
	return <h3 id={id}>
		{children}
		<a href={'#' + id} className='anchor'>#</a>
	</h3>
}