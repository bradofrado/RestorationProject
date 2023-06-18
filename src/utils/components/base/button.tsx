import React from 'react';
import { type PolymorphicComponentProps } from '~/utils/types/polymorphic';

type ButtonType = 'primary' | 'secondary' | 'other'
type ButtonProps = {
    mode?: 'primary' | 'secondary',
    className?: string,
	backgroundColor?: string
} | {
	mode: 'other',
	backgroundColor: string,
	className?: string
}
type TextProps<C extends React.ElementType> = PolymorphicComponentProps<C, ButtonProps>
const Button = <T extends React.ElementType>({children, as, mode = 'primary', backgroundColor, className, ...rest}: TextProps<T>) => {
    const Component = as || 'button';
	const buttonClasses: {[key in ButtonType]: string} = {
		'primary': 'bg-primary text-white hover:bg-opacity-80 focus-visible:outline-primary-light',
		'secondary': 'bg-white text-gray-900 hover:bg-opacity-30',
		'other': `text-secondary hover:opacity-80`
	}
	const style = mode == 'other' ? {backgroundColor}: undefined;
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`;
	return <>
		<Component className={_class} style={style}
			{...rest}
		>{children}</Component>
	</>
}

export default Button;