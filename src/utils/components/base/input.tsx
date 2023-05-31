import React from 'react';
type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> & React.PropsWithChildren & {
	onChange?: (value: string) => void
}
const Input = ({children, onChange, className, ...rest}: InputProps) => {
	return <>
		<label>{children}</label>
		<input className={`${className || ''} bg-black bg-opacity-20 inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
			{...rest} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
		/>
	</>
}

export default Input;