import React from "react";
import { type PolymorphicComponentProps } from "../types/polymorphic";
import { DeleteIcon, IconComponent } from "./icons/icons";

interface EditableProps {
	children: string,
	className?: string,
	icons?: ButtonIcon[]
}

type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  EditableProps
>

type ButtonIcon = {
	icon: IconComponent,
	handler: () => void,
} | JSX.Element

function Editable<T extends React.ElementType>({children, as, className, icons, ...rest}: TextProps<T>) {
	const Component = as || 'span';

	const classAll: string = 'hover:bg-sky-200/50 p-2 rounded-md peer' + (className || '');
	
	return <div className="relative"> 
		
		<Component {...rest} contentEditable="true" className={classAll}>{children}</Component>
		<div className="transition-all peer-focus:opacity-100 peer-hover:opacity-100 opacity-0 invisible peer-focus:visible peer-hover:visible hover:visible hover:opacity-100 absolute -top-8 ">
			{icons?.map((icon, i) => {
				if ("icon" in icon) {
					const Icon = icon.icon;
					const className = i > 0 ? 'ml-1' : '';
					return <button className={`rounded-md bg-slate-50 hover:bg-slate-300 p-1 ${className}`}
						onClick={icon.handler} key={i}
					>
						<Icon className="h-5 w-5"/>
					</button>
				} else {
					return icon;
				}
			})}
		</div>
	</div>
}

export type ContentEditableComponent = {contentEditable?: boolean | "true" | "false" };


export default Editable;