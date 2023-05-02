import React from 'react'

export const Abbr = ({children}: { children: React.ReactNode }) => <abbr style={{userSelect: 'none'}}>
	{children}
</abbr>