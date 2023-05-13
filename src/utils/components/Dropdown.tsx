import { Menu, Transition } from "@headlessui/react"
import { Fragment, type PropsWithChildren } from "react"
import { CheckIcon, IconComponent } from "./icons/icons"

export interface DropdownItem {
	handler: React.MouseEventHandler<HTMLButtonElement>,
	label: React.ReactNode
}
interface DropdownProps extends PropsWithChildren {
	items: DropdownItem[],
	className?: string
}

const Dropdown = ({children, items, className = "inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"}: DropdownProps) => {
	return <>
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className={className}>
					{children}
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
						{items.map((item, i) => 
						<Menu.Item key={i}>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-violet-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									onClick={item.handler}
								>
									{item.label}
								</button>
							)}
						</Menu.Item>
						)}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	</>
}

export interface ListItem {
	label: React.ReactNode,
	value: boolean
}

interface ListItemProps extends Omit<DropdownItemProps, 'items'>{
	items: ListItem[],
	setItems: (items: ListItem[]) => void
}

export const DropdownList = ({items, setItems, ...rest}: ListItemProps) => {
	const copy = items.slice();
	const onSelect = (item: ListItem) => {
		item.value = !item.value;
		setItems(copy);
	}
	const dropdownItems = copy.map(item => ({label: <span>{item.value && <CheckIcon className="w-3 h-3 inline"/>} {item.label}</span>, handler: () => onSelect(item)}))
	return <>
		<DropdownIcon items={dropdownItems} {...rest}/>
	</>
}

interface DropdownItemProps {
	items: DropdownItem[],
	icon: IconComponent,
	className: string
}
export const DropdownIcon = ({items, icon, className}: DropdownItemProps) => {
	const Icon = icon;
	return <>
		<Dropdown className={`rounded-md bg-slate-50 hover:bg-slate-300 p-1 ${className}`} 
				items={items}>
			<Icon className="h-5 w-5"/>
		</Dropdown>
	</>
}

export default Dropdown;