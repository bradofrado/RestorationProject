import {Fragment} from 'react';
import {Popover as ReactPopover, Transition} from '@headlessui/react';

type PopoverProps = React.PropsWithChildren<{
    button: React.ReactNode
}>
const Popover = ({children, button}: PopoverProps) => {
    return <>
      <ReactPopover className="relative">
        {() => (
          <>
            <ReactPopover.Button>
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

export default Popover;