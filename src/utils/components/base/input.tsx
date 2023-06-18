import React from 'react';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
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

export default Input;