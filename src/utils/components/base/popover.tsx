import {Fragment} from 'react';
import {Popover as ReactPopover, Transition} from '@headlessui/react';
import { ReplaceWithName } from '~/utils/utils';
import { IconComponent } from '../icons/icons';
import Button from './button';

type PopoverProps = React.PropsWithChildren<{
    button: React.ReactNode,
    className?: string
}>
const Popover = ({children, button, className}: PopoverProps) => {
  return <>
    <ReactPopover className="relative inline-block">
      {() => (
        <>
          <ReactPopover.Button className={className}>
            {button}
          </ReactPopover.Button>
          <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <ReactPopover.Panel className="absolute top-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-2 z-10">
                {children}
              </ReactPopover.Panel>
            </Transition>
        </>
      )}
    </ReactPopover>
  </>
}

type PopoverIconProps = React.PropsWithChildren<ReplaceWithName<PopoverProps, 'button', {icon: IconComponent}>>;
export const PopoverIcon = ({icon, children, className, ...rest}: PopoverIconProps) => {
  const Icon = icon;
  return <>
    <Popover button={<Icon className="h-5 w-5"/>} className={`bg-slate-50 hover:bg-slate-300 p-1 rounded-md ${className || ''}`} {...rest}>
      {children}
    </Popover>
  </>
}

export default Popover;