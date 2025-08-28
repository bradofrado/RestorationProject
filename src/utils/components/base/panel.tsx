import React from 'react';
type PanelProps = {
  className?: string;
  disabled?: boolean;
  role?: string;
} & React.PropsWithChildren;
const Panel = ({ children, className, disabled = false, role }: PanelProps) => {
  return (
    <>
      <div
        className={`${
          className || ''
        } relative rounded-xl bg-white p-3 shadow-md ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}
        role={role}
      >
        {disabled && (
          <div className="absolute left-0 top-0 z-10 h-full w-full rounded-xl bg-red-200 opacity-50"></div>
        )}
        {children}
      </div>
    </>
  );
};

export default Panel;
