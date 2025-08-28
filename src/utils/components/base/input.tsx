import React from 'react';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { type ReplaceWithName } from '~/utils/utils';
import { useStateUpdate } from '../hooks/hooks';
type InputProps = React.PropsWithChildren & {
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  value?: string | number | readonly string[] | undefined;
  inputClass?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
};
type TextProps<C extends React.ElementType> = PolymorphicCustomProps<
  C,
  InputProps,
  { include?: C }
>;
const Input = <T extends React.ElementType>({
  children,
  onChange,
  onBlur,
  value,
  include,
  required,
  inputClass,
  type = 'input',
  ...rest
}: TextProps<T>) => {
  const [tempValue, setTempValue] = useStateUpdate(value);
  const Component = include || 'div';
  const props = {
    className: `${
      inputClass || ''
    } rounded-md border border-gray-200 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-light sm:text-sm sm:leading-6 focus-visible:outline-none focus:outline-none focus:border-gray-200`,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (onChange) {
        onChange(e.target.value);
      }
      setTempValue(e.target.value);
    },
    onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onBlur && onBlur(e.target.value),
    required,
    value: tempValue,
  };
  const input =
    type == 'textarea' ? (
      <textarea {...props}></textarea>
    ) : (
      <input {...props} type={type} />
    );
  if (include) {
    return (
      <Component {...rest}>
        {input}
        {children}
      </Component>
    );
  }
  return input;
};

type NumberInputProps<C extends React.ElementType> = PolymorphicCustomProps<
  C,
  ReplaceWithName<
    InputProps,
    'type' | 'onChange',
    { min?: number; max?: number; onChange: (value: number) => void }
  >,
  { include?: C }
>;
export const NumberInput = <T extends React.ElementType>({
  children,
  onChange,
  value,
  include,
  required,
  inputClass,
  min,
  max,
  ...rest
}: NumberInputProps<T>) => {
  const Component = include || 'div';

  const onNumberChange = (value: string) => {
    const number = parseInt(value);
    if (min != undefined && number < min) {
      return;
    }

    if (max != undefined && number > max) {
      return;
    }

    if (onChange) {
      onChange(number);
    }
  };
  const props = {
    className: `${
      inputClass || ''
    } rounded-md border border-gray-200 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-light sm:text-sm sm:leading-6 focus-visible:outline-none focus:outline-none focus:border-gray-200`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onNumberChange(e.target.value),
    required,
  };
  const input = <input {...props} value={value} type="number" />;
  if (include) {
    return (
      <Component {...rest}>
        {input}
        {children}
      </Component>
    );
  }
  return input;
};

type CheckboxInputProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};
export const CheckboxInput = ({ value, onChange }: CheckboxInputProps) => {
  return (
    <>
      <input
        className="h-4 w-4 rounded-md border-gray-300 bg-gray-100 text-primary focus:ring-2 focus:ring-primary-light dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </>
  );
};

export default Input;
