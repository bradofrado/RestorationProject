import { type PolymorphicComponentProps } from "~/utils/types/polymorphic";
import { type ContentEditable } from "../edit/add-component";

type Headers = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeaderType<C extends Headers> = PolymorphicComponentProps<C, ContentEditable>

const Header = <T extends Headers,>({children, className, as, ...rest}: HeaderType<T>): JSX.Element => {
	const Component = as || 'h2';
	const size: Record<Headers, string> = {
		"h1": "text-2xl",
		"h2": "text-xl",
		"h3": "text-l",
		"h4": "text-m",
		"h5": "text-s",
		"h6": "text-xs"
	}
	return <Component className={`${size[Component]} font-bold leading-9 tracking-tight text-gray-900 ${className || ''}`} {...rest}>{children}</Component>
}

export default Header;