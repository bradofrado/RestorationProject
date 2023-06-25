import React, { type PropsWithChildren } from "react";
import { type PolymorphicComponentProps } from "../../types/polymorphic";
import { type IconComponent } from "../icons/icons";

interface EditableProps extends PropsWithChildren {
	icons?: ButtonIcon[],
	editable?: 'true' | 'false' | boolean,
	wrapped?: boolean
}

type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  EditableProps
>

export interface EditableComponentProps<T> {
	onDelete: () => void,
	onEdit: (data: T) => void,
	data: T 
}

export type EditableComponent<T> = React.ComponentType<EditableComponentProps<T>>

export type ButtonIcon = {
	icon: IconComponent,
	handler: () => void,
} | JSX.Element

export type ContentEditableComponent = {contentEditable?: boolean | "true" | "false" };

function Editable<T extends React.ElementType>({children, as, icons, editable = 'true', wrapped = false, ...rest}: TextProps<T>) {
	const Component = as || 'span';
	
	const render = wrapped ? children : <Component {...rest} contentEditable={editable}>{children}</Component>
	return <div className="relative"> 
		
		<div className="hover:bg-sky-200/50 p-2 rounded-md peer">
			{render}
		</div>
		<div className="transition-all peer-focus:opacity-100 peer-hover:opacity-100 opacity-0 invisible peer-focus:visible peer-hover:visible hover:visible hover:opacity-100 absolute -top-8 z-20">
			{icons?.map((icon, i) => {
				if ("icon" in icon) {
					const Icon = icon.icon;
					const className = i > 0 ? 'ml-1' : '';
					return <button className={`rounded-md bg-slate-50 hover:bg-slate-300 p-1 ${className}`}
						onClick={icon.handler} key={i}
						data-testid="editable-edit-icon"
					>
						<Icon className="h-5 w-5"/>
					</button>
				} else {
					return <span key={i} data-testid="editable-edit-icon">{icon}</span>;
				}
			})}
		</div>
	</div>
}

export default Editable;