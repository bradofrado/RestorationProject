import { type PolymorphicComponentProps } from "~/utils/types/polymorphic";

type Headers = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeaderType<C extends Headers> = PolymorphicComponentProps<C, object>

const Header = <T extends Headers,>({children, className, as, ...rest}: HeaderType<T>): JSX.Element => {
	const Component = as || 'h2';
	return <Component className={`text-xl font-bold ${className || ''}`} {...rest}>{children}</Component>
}

export default Header;