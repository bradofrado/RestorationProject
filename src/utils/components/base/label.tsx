import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type LabelProps = {
  className?: string;
  label: string;
  error?: string | null;
  sameLine?: boolean;
  tooltip?: string;
} & React.PropsWithChildren;
const Label = ({
  children,
  className,
  label,
  error,
  sameLine = false,
  tooltip,
}: LabelProps) => {
  className = sameLine
    ? `flex items-center justify-between ${className || ''}`
    : className;
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-sm font-medium leading-6 text-gray-900">
        {label}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </label>
      <div className={sameLine ? 'ml-1' : 'mt-1'}>{children}</div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Label;
