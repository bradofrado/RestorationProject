import { type PolymorphicComponentProps } from "../types/polymorphic";

interface EditableProps {
	children: string,
}

type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  EditableProps
>

function Editable<T extends React.ElementType>({children, as, ...rest}: TextProps<T>) {
	const Component = as || 'span';
	
	return <> 
		<Component {...rest} contentEditable="true">{children}</Component>
	</>
}

export default Editable;