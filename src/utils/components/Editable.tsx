import { type PolymorphicComponentProps } from "../types/polymorphic";
import { DeleteIcon } from "./icons/icons";

interface EditableProps {
	children: string,
	className?: string,
	onDelete?: () => void
}

type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  EditableProps
>

function Editable<T extends React.ElementType>({children, as, className, onDelete, ...rest}: TextProps<T>) {
	const Component = as || 'span';

	const classAll: string = 'hover:bg-sky-200/50 p-2 rounded-md peer' + (className || '');
	
	return <div className="relative"> 
		
		<Component {...rest} contentEditable="true" className={classAll}>{children}</Component>
		{onDelete && <button className="transition-all peer-focus:opacity-100 opacity-0 invisible peer-focus:visible hover:visible absolute -top-8 rounded-md bg-slate-50 hover:bg-slate-300 p-1"
			onClick={onDelete}
		>
			<DeleteIcon className="h-5 w-5"/>
		</button>}
	</div>
}




export default Editable;