import React from 'react';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { type ReplaceWithName } from '~/utils/utils';
type InputProps = React.PropsWithChildren & {
	onChange?: (value: string) => void,
    value?: string | number | readonly string[] | undefined,
    inputClass?: string,
    type?: React.HTMLInputTypeAttribute,
    required?: boolean
}
type TextProps<C extends React.ElementType> = PolymorphicCustomProps<C, InputProps, {include?: C}>
const Input = <T extends React.ElementType>({children, onChange, value, include, required, inputClass, type="input", ...rest}: TextProps<T>) => {
    const Component = include || 'div';
    const props = {
        className: `${inputClass || ''} rounded-md border border-gray-200 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-light sm:text-sm sm:leading-6 focus-visible:outline-none focus:outline-none focus:border-gray-200`,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange && onChange(e.target.value),
        required
    }
    const input = type == "textarea" ? <textarea {...props} value={value}></textarea> : <input {...props} value={value} type={type}/>
    if (include) {
        return <Component {...rest}>{input}{children}</Component>
    }
	return input;
}

type NumberInputProps<C extends React.ElementType> = PolymorphicCustomProps<C, ReplaceWithName<InputProps, 'type' | 'onChange', {min?: number, max?: number, onChange: (value: number) => void}>, {include?: C}>
export const NumberInput = <T extends React.ElementType>({children, onChange, value, include, required, inputClass, min, max, ...rest}: NumberInputProps<T>) => {
    const Component = include || 'div';
    
    const onNumberChange = (value: string) => {
        const number = parseInt(value);
        if (min != undefined && number < min) {
            return;
        }

        if (max != undefined && number > max) {
            return;
        }

        onChange && onChange(number);
    }
    const props = {
        className: `${inputClass || ''} rounded-md border border-gray-200 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-light sm:text-sm sm:leading-6 focus-visible:outline-none focus:outline-none focus:border-gray-200`,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onNumberChange(e.target.value),
        required
    }
    const input = <input {...props} value={value} type="number"/>
    if (include) {
        return <Component {...rest}>{input}{children}</Component>
    }
	return input;
}

export default Input;