import React from 'react';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
type InputProps = React.PropsWithChildren & {
	onChange?: (value: string) => void,
    value?: string | number | readonly string[] | undefined,
    inputClass?: string,
    type?: "input" | "textarea"
}
type TextProps<C extends React.ElementType> = PolymorphicCustomProps<C, InputProps, {include?: C}>
const Input = <T extends React.ElementType>({children, onChange, value, include, inputClass, type="input", ...rest}: TextProps<T>) => {
    const Component = include || 'div';
    const props = {
        className: `${inputClass || ''} bg-white border shadow-sm rounded-md px-3 py-1.5 text-sm text-gray-900 focus:border-primary focus-visible:outline-none `,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange && onChange(e.target.value)
    }
    const input = type == "input" ? <input {...props} value={value}/> : <textarea {...props} value={value}></textarea>
    if (include) {
        return <Component {...rest}>{input}{children}</Component>
    }
	return input;
}

export default Input;