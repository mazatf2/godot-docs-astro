import React from 'react'

export const H3 = ({children, id}: { children: React.ReactNode, id: string }) => {
	return <h3 id={id}>
		<code>{children}</code>
		<a href={'#' + id}>#</a>
	</h3>
}
