import React from 'react';

type ButtonType = 'primary' | 'secondary'
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {mode?: ButtonType}
const Button = ({children, mode = 'primary', className, ...rest}: ButtonProps) => {
	const buttonClasses: {[key in ButtonType]: string} = {
		'primary': 'bg-primary',
		'secondary': 'bg-black bg-opacity-20'
	}
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`;
	return <>
		<button className={_class}
			{...rest}
		>{children}</button>
	</>
}

export default Button;