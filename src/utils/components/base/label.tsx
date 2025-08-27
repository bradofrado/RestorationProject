type LabelProps = {
  className?: string;
  label: string;
  error?: string | null;
  sameLine?: boolean;
} & React.PropsWithChildren;
const Label = ({
  children,
  className,
  label,
  error,
  sameLine = false,
}: LabelProps) => {
  className = sameLine
    ? `flex items-center justify-between ${className || ''}`
    : className;
  return (
    <div className={className}>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className={sameLine ? 'ml-1' : 'mt-1'}>{children}</div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Label;
