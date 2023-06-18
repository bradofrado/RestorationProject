type LabelProps = {
    className?: string,
    label: string,
    error?: string | null
} & React.PropsWithChildren;
const Label = ({children, className, label, error}: LabelProps) => {
    return <div className={className}>
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
        <div className="mt-1">{children}</div>
        {error && <div>{error}</div>}
    </div>
}

export default Label;