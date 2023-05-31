import React from 'react';
import { type PolymorphicComponentProps } from '~/utils/types/polymorphic';

type ButtonType = 'primary' | 'secondary'
type ButtonProps = {
    mode?: ButtonType,
    className?: string
}
type TextProps<C extends React.ElementType> = PolymorphicComponentProps<C, ButtonProps>
const Button = <T extends React.ElementType>({children, as, mode = 'primary', className, ...rest}: TextProps<T>) => {
    const Component = as || 'button';
	const buttonClasses: {[key in ButtonType]: string} = {
		'primary': 'bg-blue-600 text-white hover:bg-blue-500',
		'secondary': 'bg-white text-gray-900 hover:bg-opacity-30'
	}
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`;
	return <>
		<Component className={_class}
			{...rest}
		>{children}</Component>
	</>
}

export default Button;