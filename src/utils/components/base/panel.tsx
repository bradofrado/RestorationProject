import React from 'react';
type PanelProps = {
	className?: string
} & React.PropsWithChildren
const Panel = ({children, className}: PanelProps) => {
	return <>
		<div className={`${className || ''} bg-white rounded-xl p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}>
			{children}
		</div>
	</>
}

export default Panel;