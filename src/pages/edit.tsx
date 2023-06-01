import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Dropdown, { type ItemAction, type DropdownItem } from "~/utils/components/base/dropdown";
import Button from "~/utils/components/base/button";
import { useEventPagesMutation, useGetPageNames, useGetPages } from "~/utils/services/EventPageService";
import { useCategoryMutations, useGetCategories, useTimelineMutations } from "~/utils/services/TimelineService";
import { type EventPage, type ComponentSettings, type EditableData } from "~/utils/types/page";
import { type RestorationTimelineItem, type TimelineCategory, type TimelineCategoryName } from "~/utils/types/timeline";
import {useChangeProperty, groupByDistinct} from '~/utils/utils';
import Panel from "~/utils/components/base/panel";
import AddRemove from "~/utils/components/base/addremove";
import Input from "~/utils/components/base/input";
import TabControl, { type TabItem } from "~/utils/components/base/tab";
import EditItemsButtons from "~/utils/components/edit/edit-items-buttons";
import Editable from "~/utils/components/edit/editable";
import AddComponent, { type ComponentType, CustomComponent } from "~/utils/components/edit/add-component";
import Label from "~/utils/components/base/label";

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
			<TabControl items={tabItems} className="w-full px-2 py-6 sm:px-0"/>
		</div>
	</>
}


type EditPagesProps = {
	id: string | undefined,
	setId: (id: string | undefined) => void
}
const EditPages = ({id, setId}: EditPagesProps) => {
	const [currPage, setCurrPage] = useState<EventPage>();
	const {create, update, deletem} = useEventPagesMutation();
	const query = useGetPages();

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
		setCurrPage({id: '', url: "new-url", title: "Book of Mormon Translation", description: "Text", settings: []});
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
				<Input include={Label} label="Url" value={currPage.url} onChange={onNameChange} className="ml-1 my-1"/>
				<Button as={Link} href={`/${currPage.url}`} className="ml-1">Go</Button>
			</div>
			<EditablePage page={currPage} setPage={setCurrPage} />
			</>}
		</div>	
	</>
}

const EditTimelineItems = () => {
	const [category, setCategory] = useState<TimelineCategory>();
	const [markedForDelete, setMarkedForDelete] = useState<Record<number, boolean>>({});
	const changeProperty = useChangeProperty<TimelineCategory>(setCategory);
	const {update, create, deletem} = useCategoryMutations();
	const {update: updateItem, create: createItem, deletem: deleteItem} = useTimelineMutations();
	const pageQuery = useGetPageNames();
	const categoryQuery = useGetCategories();
	if (pageQuery.isLoading || pageQuery.isError || categoryQuery.isLoading || categoryQuery.isError) {
		return <></>
	}
	const pages = pageQuery.data;
	const categories = categoryQuery.data;
	const categoriesGroup = groupByDistinct(categories, "name");
	const categoryNames: DropdownItem<TimelineCategoryName>[] = categories.map(x => ({name: x.name, id: x.name}))

	const onAdd = () => {
		const newCategory: TimelineCategory = {
			id: -1,
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
			deletem(category.id);
	}

	const onChange: ItemAction<TimelineCategoryName> = (item) => {
		const category = categoriesGroup[item.id];
		setCategory(category);
	}

	const onPageChange: ItemAction<string> = (value) => {
		if (!category) return;
		changeProperty(category, "page", value.id);
	}

	const onItemDelete = (i: number) => {
		if (!category) return;

		const item = category.items[i];
		if (!item) return;

		if (item.id > 0) {
			const markCopy = {...markedForDelete};
			markCopy[item.id] = true;
			setMarkedForDelete(markCopy);
		} else {
			const copy = category.items.slice();
			copy.splice(i, 1);
			changeProperty(category, "items", copy);
		}
	}

	const onItemAdd = () => {
		if (!category) return;
		const copy = category.items.slice();
		copy.push({
			id: -1,
			text: "new text", 
			date: new Date(), 
			endDate: null, 
			links: [], 
			subcategory: null, 
			categoryId: category.id
		});
		changeProperty(category, "items", copy);
	}

	const saveItem = (item: RestorationTimelineItem, i: number) => {
		if (!category) return;
		const copy = category.items.slice();
		if (markedForDelete[item.id]) {
			copy.splice(i, 1);
			item.id > 0 && deleteItem(item.id);
			
			deleteMarkedForDelete(item.id);
		} else {
			copy[i] = item;
			item.id < 0 ? createItem(item) : updateItem(item);
		}
		changeProperty(category, "items", copy);
	}

	const deleteMarkedForDelete = (id: number) => {
		const markCopy = {...markedForDelete};
		markCopy[id] = false;
		setMarkedForDelete(markCopy);
	}
	
	return <>
		<div>
			<EditItemsButtons items={categoryNames} value={category?.name} onChange={onChange}
				onAdd={onAdd} onSave={onSave} onClear={onClear} onDelete={onDelete}/>
			{category && <>
			<div className="my-2">
				<Input include={Label} label="Name" className="my-1" value={category.name} onChange={value => changeProperty(category, "name", value)}/>
				<Label label="Page" className="my-2">
					<Dropdown items={pages.map(x => ({name: x, id: x}))} initialValue={category?.page} onChange={onPageChange}></Dropdown>
				</Label>
			</div>
			<AddRemove items={category.items.map((item, i) => 
				<EditRestorationItem key={i} item={item} onSave={(item: RestorationTimelineItem) => saveItem(item, i)} disabled={markedForDelete[item.id]} cancelDisabled={deleteMarkedForDelete}/>)}
				onAdd={onItemAdd} onDelete={onItemDelete}
			/>
			</>}
		</div>
	</>
}

type EditRestorationItemProps = {
	item: RestorationTimelineItem,
	onSave: (item: RestorationTimelineItem) => void,
	disabled?: boolean,
	cancelDisabled: (id: number) => void
}
const EditRestorationItem = ({item: propItem, disabled=false, onSave: onSaveProp, cancelDisabled}: EditRestorationItemProps) => {
	const [item, setItem] = useState<RestorationTimelineItem>(propItem);
	const [isDirty, setIsDirty] = useState(false);
	const changePropertyItem = useChangeProperty<RestorationTimelineItem>((item: RestorationTimelineItem) => {
		setIsDirty(true);
		setItem(item);
	});
	useEffect(() => {
		if (propItem.id < 0) {
			setIsDirty(true);
		}
		setItem(propItem);
		
	}, [propItem])

	// useEffect(() => {
	// 	setIsDirty(isDirty || disabled);
	// }, [disabled, isDirty]);
	
	const onLinkChange = (value: string, i: number) => {
		const links = item.links;
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

	const onCancel = () => {
		console.log(propItem);
		setItem(propItem);
		setIsDirty(false);
		disabled && cancelDisabled(propItem.id);
	}

	const onSave = () => {
		setIsDirty(false);
		onSaveProp(item);
	}
	return <>
		<Panel className="my-1" disabled={disabled}>
			<Input include={Label} label="Text" type="textarea" value={item.text} inputClass="w-full" onChange={value => changePropertyItem(item, "text", value)}/>
			<Label label="Start" className="inline-block my-1 mr-1">
				<DatePicker value={dayjs(item.date)} onChange={value => changePropertyItem(item, "date", value?.toDate() || new Date())}/>
			</Label>
			<Label label="End" className="inline-block my-1 mx-1">
				<DatePicker value={item.endDate && dayjs(item.endDate)} onChange={value => changePropertyItem(item, "date", value?.toDate() || new Date())}/>
			</Label>
			<Label label="Links" className="my-1">
				<AddRemove items={item.links.map((link, i) => <Input key={i} value={link} inputClass="w-full" onChange={(value: string) => onLinkChange(value, i)}/>)}
					onAdd={onAddLink} onDelete={onDeleteLink}/>
			</Label>
			{(isDirty || disabled) && <div className="my-1 text-right mx-4 z-20 relative">
				<Button className="mx-1" mode="secondary" onClick={onCancel}>Cancel</Button>
				<Button mode="primary" onClick={onSave}>Save</Button>
			</div>}
		</Panel>
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