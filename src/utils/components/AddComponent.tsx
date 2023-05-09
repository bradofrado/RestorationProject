import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Editable from './Editable'
import { type PolymorphicComponentProps } from '../types/polymorphic'
//import { ChevronDownIcon } from '@heroicons/react/20/solid'

export interface onDeleteComponent {
	onDelete: () => void
}
interface Component {
	label: string,
	component: React.ElementType<onDeleteComponent>//(props: onDeleteComponent) => JSX.Element
}

type Headers = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeaderType<C extends Headers> = PolymorphicComponentProps<C, object>

const Header = <T extends Headers,>({children, className, as, ...rest}: HeaderType<T>): JSX.Element => {
	const Component = as || 'h2';
	return <Component className={`text-xl font-bold ${className || ''}`} {...rest}>{children}</Component>
}

const components: Component[] = [
	{
		label: 'Header',
		component: ({onDelete}) => <Editable as={Header} onDelete={onDelete}>
											Text
										</Editable>
	},
	{
		label: 'Paragraph',
		component: ({onDelete}) => <Editable as="p" onDelete={onDelete}>
											Text
										</Editable>
	},
]

export default function AddComponent({onAdd}: {onAdd: (component: React.ElementType<onDeleteComponent>) => void}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					+
					{/* <ChevronDownIcon
						className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
						aria-hidden="true"
					/> */}
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						{components.map((comp, i) => 
						<Menu.Item key={i}>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-violet-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									onClick={() => onAdd(comp.component)}
								>
									{comp.label}
								</button>
							)}
						</Menu.Item>
						)}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
  )
}

//type IconComponent = (props: React.ComponentPropsWithoutRef<'svg'>) => JSX.Element;

// const EditInactiveIcon: IconComponent = (props) => {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 13V16H7L16 7L13 4L4 13Z"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// const EditActiveIcon: IconComonent = (props) => {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 13V16H7L16 7L13 4L4 13Z"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function DuplicateInactiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 4H12V12H4V4Z"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <path
//         d="M8 8H16V16H8V8Z"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function DuplicateActiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 4H12V12H4V4Z"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <path
//         d="M8 8H16V16H8V8Z"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function ArchiveInactiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   )
// }

// function ArchiveActiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   )
// }

// function MoveInactiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   )
// }

// function MoveActiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
//     </svg>
//   )
// }

// function DeleteInactiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="6"
//         width="10"
//         height="10"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   )
// }

// function DeleteActiveIcon(props: IconComponent) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="6"
//         width="10"
//         height="10"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
//     </svg>
//   )
// }
