import React from 'react';
import { type PolymorphicComponentProps } from '~/utils/types/polymorphic';

export type ButtonType = 'primary' | 'secondary' | 'other'
type ButtonPropsInner = {
    mode?: 'primary' | 'secondary',
    className?: string,
	backgroundColor?: string
} | {
	mode: 'other',
	backgroundColor: string,
	className?: string
}
export type ButtonProps<C extends React.ElementType> = PolymorphicComponentProps<C, ButtonPropsInner>
const Button = <T extends React.ElementType>({children, as, mode = 'primary', backgroundColor, className, ...rest}: ButtonProps<T>) => {
    const Component = as || 'button';
	const buttonClasses: {[key in ButtonType]: string} = {
		'primary': 'bg-primary text-white hover:bg-opacity-80 focus-visible:outline-primary-light',
		'secondary': 'bg-slate-50 hover:bg-slate-300 text-gray-900',
		'other': `text-secondary hover:opacity-80`
	}
	const style = mode == 'other' ? {backgroundColor}: undefined;
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex border justify-center rounded-md px-2 py-1 text-sm font-semibold leading-6 shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`;
	return <>
		<Component className={_class} style={style}
			{...rest}
		>{children}</Component>
	</>
}

export default Button;