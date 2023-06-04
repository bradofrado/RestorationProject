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
		'primary': 'bg-primary text-white hover:bg-opacity-80',
		'secondary': 'bg-white text-gray-900 hover:bg-opacity-30',
		'other': `text-secondary hover:opacity-80`
	}
	const style = mode == 'other' ? {backgroundColor}: undefined;
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`;
	return <>
		<Component className={_class} style={style}
			{...rest}
		>{children}</Component>
	</>
}

export default Button;