'use client';

import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface TabItem {
  label: string;
  component: React.ReactElement;
  className?: string;
  href?: string;
}

type TabControlProps = {
  items: TabItem[];
  className?: string;
  selectedIndex?: number;
};

export default function TabControl({
  items,
  className,
  selectedIndex: selectedIndexProps,
}: TabControlProps) {
  const [selectedIndex, setSelectedIndex] = useState(selectedIndexProps);
  useEffect(() => {
    if (selectedIndex !== selectedIndexProps) {
      setSelectedIndex(selectedIndexProps);
    }
  }, [selectedIndexProps, selectedIndex]);

  const router = useRouter();

  return (
    <div className={className}>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {items.map((item, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-light focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
              onClick={() => {
                if (item.href) {
                  router.push(item.href);
                }
              }}
            >
              {item.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-2">
          {items.map((item, idx) => {
            return (
              <TabPanel
                key={idx}
                className={classNames(
                  'rounded-xl p-3',
                  item.className,
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2'
                )}
              >
                {item.component}
              </TabPanel>
            );
          })}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
