import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddComponent, { type ComponentType, CustomComponent } from "~/utils/components/AddComponent";
import Dropdown, { ItemAction, type DropdownItem } from "~/utils/components/Dropdown";
import Editable, { ButtonIcon } from "~/utils/components/Editable";
import TabControl, { TabItem } from "~/utils/components/Tab";
import { DeleteIcon } from "~/utils/components/icons/icons";
import { useService } from "~/utils/react-service-container";
import useEventPages from "~/utils/services/EventPageService";
import  EventPageService, { useEventPagesMutation } from "~/utils/services/EventPageService";
import { TimelineService, useCategoryMutations } from "~/utils/services/TimelineService";
import { type EventPage, type ComponentSettings, type EditableData } from "~/utils/types/page";
import { RestorationTimelineItem, TimelineCategory, TimelineCategoryName } from "~/utils/types/timeline";
import {useChangeProperty, groupBy, groupByDistinct} from '~/utils/utils';

const Edit_page: NextPage = () => {
	const router = useRouter();
	
	const {id} = router.query;

	if (!router.isReady) {
		return <div>Loading...</div>
	}

	const setRoute = (id: string | undefined) => {
		id ? void router.push(`${router.basePath}?id=${id}`) : void router.push(`${router.basePath}`);
	}

	const tabItems: TabItem[] = [
		{
			label: "Page Items",
			component: <EditPages setId={setRoute} id={Array.isArray(id) ? id[0] : id}/>
		},
		{
			label: "Timeline Items",
			component: <EditTimelineItems/>,
		}
	]
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 my-10 w-full">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<TabControl items={tabItems}/>
		</div>
	</>
}

type ButtonType = 'primary' | 'secondary'
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {mode?: ButtonType}
const Button = ({children, mode = 'primary', className, ...rest}: ButtonProps) => {
	const buttonClasses: {[key in ButtonType]: string} = {
		'primary': 'bg-primary',
		'secondary': 'bg-black bg-opacity-20'
	}
	const _class = `${className || ''} ${buttonClasses[mode]} inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`;
	return <>
		<button className={_class}
			{...rest}
		>{children}</button>
	</>
}

type EditPagesProps = {
	id: string | undefined,
	setId: (id: string | undefined) => void
}
const EditPages = ({id, setId}: EditPagesProps) => {
	const [currPage, setCurrPage] = useState<EventPage>();
	const {create, update, deletem} = useEventPagesMutation();
	const pageService = useService(EventPageService);
	const query = pageService.getPages();

	let pages: EventPage[] | null = null;

	useEffect(() => {
		if (query.data) {
			const page = query.data.find(x => x.id == id);
			console.log(page);
			page && setCurrPage(page);
		}
		console.log(id);
		console.log(query.data)
	}, [query.data, id])

	if (query.isLoading) {
		return <div>Loading...</div>
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>
	}
	
	pages = query.data;
	const items: DropdownItem<string>[] = pages.map(page => ({name: page.url, id: page.id }));

	const onChange = (item: DropdownItem<string>, index: number) => {
		setId(item.id);
		setCurrPage(pages && pages[index] || undefined);
	}

	const onAddPage = () => {
		setCurrPage({id: '', url: "book-of-mormon", title: "Book of Mormon Translation", description: "Text", settings: []});
	}

	const onSave = (isNew: boolean) => {
		if (currPage) {
			isNew ? create(currPage) : update(currPage)
			setId(currPage.id);
			alert("Page saved!")
		}
	}

	const onDelete = (isNew: boolean) => {
		if (currPage && !isNew) {
			deletem(currPage.id);
			setCurrPage(undefined);
			setId(undefined);
		}
	}

	const onClear = () => {
		setCurrPage(undefined);
	}

	const onNameChange = (value: string) => {
		if (currPage == undefined) return;
		const copy: EventPage = {...currPage};
		copy.url = value;
		setCurrPage(copy);
	}

	return <>
		<div>
			<EditItemsButtons items={items} value={currPage?.url} onChange={onChange}
				onAdd={onAddPage} onSave={onSave} onDelete={onDelete} onClear={onClear}/>
			{currPage && <>
			<div className="py-1">
				<Input value={currPage.url} onChange={onNameChange} className="ml-1">
					Url:
				</Input>
				<Link href={`/${currPage.url}`} className="ml-1 bg-black bg-opacity-20 inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">Go</Link>
			</div>
			<EditablePage page={currPage} setPage={setCurrPage} />
			</>}
		</div>	
	</>
}

type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> & React.PropsWithChildren & {
	onChange?: (value: string) => void
}
const Input = ({children, onChange, className, ...rest}: InputProps) => {
	return <>
		<label>{children}</label>
		<input className={`${className || ''} bg-black bg-opacity-20 inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
			{...rest} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
		/>
	</>
}

const EditTimelineItems = () => {
	const [category, setCategory] = useState<TimelineCategory>();
	const timelineService = useService(TimelineService);
	const pageService = useService(EventPageService);
	const changeProperty = useChangeProperty<TimelineCategory>(setCategory);
	const {update, create, deletem} = useCategoryMutations();
	const pages = pageService.getPageNames();
	const categories = timelineService.getCategories();
	const categoriesGroup = groupByDistinct(categories, "name");
	const categoryNames: DropdownItem<TimelineCategoryName>[] = categories.map(x => ({name: x.name, id: x.name}))

	const onAdd = () => {
		const newCategory: TimelineCategory = {
			name: 'New Category',
			page: pages[0] || 'book-of-mormon',
			items: [],
			color: '#fff'
		}
		setCategory(newCategory);
	}

	const onSave = (isNew: boolean) => {
		if (!category) {
			return;
		}
		
		isNew ? create(category) : update(category);
	}

	const onClear = () => {
		setCategory(undefined);
	}

	const onDelete = (isNew: boolean) => {
		if (category && !isNew)
			deletem(category.name);
	}

	const onChange: ItemAction<TimelineCategoryName> = (item) => {
		const category = categoriesGroup[item.id];
		//setCurrItems(category ? category.items : []);
		setCategory(category);
		//setPage(category?.page);
	}

	const onPageChange: ItemAction<string> = (value) => {
		if (!category) return;
		changeProperty(category, "page", value.id);
	}

	const onItemDelete = (i: number) => {
		if (!category) return;

		const copy = category.items.slice();
		copy.splice(i, 1);
		changeProperty(category, "items", copy);
	}

	const onItemAdd = () => {
		if (!category) return;
		const copy = category.items.slice();
		copy.push({text: "new text", date: new Date(), links: []});
		changeProperty(category, "items", copy);
	}

	const saveItem = (item: RestorationTimelineItem, i: number) => {
		if (!category) return;
		const copy = category.items.slice();
		copy[i] = item;
		changeProperty(category, "items", copy);
		//TODO: save item
	}
	
	return <>
		<div>
			<EditItemsButtons items={categoryNames} value={category?.name} onChange={onChange}
				onAdd={onAdd} onSave={onSave} onClear={onClear} onDelete={onDelete}/>
			{category && <>
			<div className="my-2">
				<Input value={category.name} onChange={value => changeProperty(category, "name", value)}>
					Name:
				</Input>
				<div>
					<span>Page:</span><Dropdown items={pages.map(x => ({name: x, id: x}))} initialValue={category?.page} onChange={onPageChange}></Dropdown>
				</div>
			</div>
			<AddRemove items={category.items.map((item, i) => <EditRestorationItem key={i} item={item} onSave={(item: RestorationTimelineItem) => saveItem(item, i)}/>)}
				onAdd={onItemAdd} onDelete={onItemDelete}
			/>
			</>}
		</div>
	</>
}

type EditRestorationItemProps = {
	item: RestorationTimelineItem,
	onSave: (item: RestorationTimelineItem) => void
}
const EditRestorationItem = ({item: propItem, onSave}: EditRestorationItemProps) => {
	const [item, setItem] = useState<RestorationTimelineItem>(propItem);
	const changePropertyItem = useChangeProperty<RestorationTimelineItem>(setItem);
	useEffect(() => {
		setItem(propItem);
	}, [propItem])
	
	const onLinkChange = (value: string, i: number) => {
		const links = item.links.slice();
		links[i] = value;
		changePropertyItem(item, "links", links);
	}

	const onAddLink = () => {
		const links = item.links.slice();
		links.push("new link");
		changePropertyItem(item, "links", links);
	}

	const onDeleteLink = (i: number) => {
		const links = item.links.slice();
		links.splice(i, 1);
		changePropertyItem(item, "links", links);
	}
	return <>
		<Panel className="my-1">
			<Input value={item.text} className="w-full" onChange={value => changePropertyItem(item, "text", value)}>
				Text:
			</Input>
			<div>
				<span>Start:</span><DatePicker value={dayjs(item.date)} onChange={value => changePropertyItem(item, "date", value?.toDate() || new Date())}/>
				<span>End:</span><DatePicker value={item.endDate && dayjs(item.endDate)} onChange={value => changePropertyItem(item, "date", value?.toDate() || new Date())}/>
			</div>
			<Button mode="primary" onClick={() => onSave(item)}>Save</Button>
			<AddRemove items={item.links.map((link, i) => <Input key={i} value={link} className="w-full" onChange={(value: string) => onLinkChange(value, i)}/>)}
				onAdd={onAddLink} onDelete={onDeleteLink}/>
		</Panel>
	</>
}

type AddRemoveProps = {
	items: React.ReactNode[],
	onDelete: (i: number) => void,
	onAdd: () => void
}
const AddRemove = ({items, onDelete, onAdd}: AddRemoveProps) => {
	return <>
		{items.map((item, i) => {
			const icons: ButtonIcon[] = [
				{
					icon: DeleteIcon,
					handler: () => onDelete(i)
				}
			]
			return <Editable icons={icons} key={i} editable="false">{item}</Editable>
		})}
		<div>
			<Button mode="secondary" className="my-1" onClick={onAdd}>
				+
			</Button>
		</div>
	</>
}

type PanelProps = {
	className?: string
} & React.PropsWithChildren
const Panel = ({children, className}: PanelProps) => {
	return <>
		<div className={`${className || ''} bg-white rounded-xl p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}>
			{children}
		</div>
	</>
}

type EditItemsAction = (isNew: boolean) => void
type EditItemsButtonsProps<T> = {
	items: DropdownItem<T>[],
	value?: string | undefined
	onAdd: EditItemsAction,
	onSave: EditItemsAction,
	onClear: EditItemsAction,
	onDelete: EditItemsAction,
	onChange: ItemAction<T>
}	
const EditItemsButtons = <T,>({items, value, onAdd, onSave, onClear, onDelete, onChange}: EditItemsButtonsProps<T>) => {
	const [isNew, setIsNew] = useState(true);

	const onAction = (action: EditItemsAction, newIsNew: boolean) => {
		return () => {
			action(isNew);
			setIsNew(newIsNew);
		}
	}

	const onDropdownChange: ItemAction<T> = (item, index) => {
		onChange(item, index);
		setIsNew(false);
	}
	return <>
		<Dropdown items={items} onChange={onDropdownChange} initialValue={value}>select</Dropdown>
		<span className="mx-1">
			{value == undefined ? 
				<Button onClick={onAction(onAdd, true)} mode="secondary">Add</Button> : 
				(<>
					<Button className="mr-1" onClick={onAction(onSave, false)}>Save</Button>
					{!isNew && <Button className="mr-1" onClick={onAction(onDelete, false)} mode="secondary">Delete</Button>}
					<Button onClick={onAction(onClear, false)} mode="secondary">Clear</Button>
				</>)}
		</span>
	</>
}

const EditablePage = ({page, setPage}: {page: EventPage, setPage: (page: EventPage) => void}) => {
	const editSettings = (f: (settings: ComponentSettings[]) => void) => {
		const copy: EventPage = {...page};
		const settings = copy.settings.slice();
		f(settings);
		copy.settings = settings;
		setPage(copy);
	}

	const onAdd = (component: ComponentType) => {
		editSettings(components => components.push({component: component, data: {content: "Text", properties: null}, id: -1, pageId: ""}));
	}

	const onEdit = (data: EditableData, i: number) => {
		editSettings(components => (components[i] || {data: null}).data = data);
	}

	const deleteComponent = (index: number) => {
		editSettings(components => components.splice(index, 1))
	}
	return <>
			<Editable as="h1" className="mx-auto text-3xl font-bold my-5 text-bom" onBlur={(e: React.FocusEvent<HTMLHeadingElement>) => setPage({...page, title: e.target.innerHTML})}>
				{page.title}
			</Editable>
			<Editable as="p" onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => setPage({...page, description: e.target.innerHTML})}>
				{page.description}
			</Editable>
			{page.settings.map((editable: ComponentSettings, i: number) => <CustomComponent editable={true} type={editable.component} key={i} onDelete={() => deleteComponent(i)} onEdit={(data: EditableData) => onEdit(data, i)} data={editable.data}/>)}
			<AddComponent onAdd={onAdd}/>
	</>
}



export default Edit_page;