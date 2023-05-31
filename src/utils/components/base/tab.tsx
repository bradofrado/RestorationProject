import { Tab } from '@headlessui/react'

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export interface TabItem {
	label: string,
	component: React.ReactElement,
	className?: string
}

type TabControlProps = {
	items: TabItem[],
  className?: string
}

export default function TabControl({items, className}: TabControlProps) {
  return (
    <div className={className}>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {items.map((item, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {item.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {items.map((item, idx) => {
						return (
							<Tab.Panel
								key={idx}
								className={classNames(
									'rounded-xl p-3',
									item.className,
									'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
								)}
							>
								{item.component}
							</Tab.Panel>
						)
					})}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
