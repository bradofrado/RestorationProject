import { getClass } from '~/utils/utils';

type HyperlinkComponentProps = React.ComponentPropsWithoutRef<'a'>;
export const Hyperlink = ({
  className,
  children,
  ...rest
}: HyperlinkComponentProps) => {
  return (
    <a
      {...rest}
      className={getClass(
        className,
        'cursor-pointer font-semibold leading-6 text-primary hover:text-opacity-80'
      )}
    >
      {children}
    </a>
  );
};
