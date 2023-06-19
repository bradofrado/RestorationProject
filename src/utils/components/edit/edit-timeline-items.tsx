import {useEffect, useState} from 'react';
import Dropdown from '~/utils/components/base/dropdown';
import {type ItemAction, type DropdownItem} from '~/utils/components/base/dropdown';
import Button from '~/utils/components/base/button';
import {useGetPages} from '~/utils/services/EventPageService';
import {useCategoryMutations, useGetCategories, useTimelineMutations} from '~/utils/services/TimelineService';
import {type RestorationTimelineItem, type TimelineCategory} from '~/utils/types/timeline';
import {useChangeProperty, groupByDistinct} from '~/utils/utils';
import Panel from '~/utils/components/base/panel';
import AddRemove from '~/utils/components/base/addremove';
import Input from '~/utils/components/base/input';
import EditItemsButtons from '~/utils/components/edit/edit-items-buttons';
import Label from '~/utils/components/base/label';
import ColorPicker from '~/utils/components/base/color-picker';
import {DateRangePicker} from '~/utils/components/base/calendar/date-picker';
import { RemoveField } from '../base/remove-field';

export const EditTimelineItems = () => {
	const [category, setCategory] = useState<TimelineCategory>();
	const [markedForDelete, setMarkedForDelete] = useState<Record<number, boolean>>({});
	const changeProperty = useChangeProperty<TimelineCategory>(setCategory);
	const {update, create, deletem} = useCategoryMutations();
	const {update: updateItem, create: createItem, deletem: deleteItem} = useTimelineMutations();
	const pageQuery = useGetPages();
	const categoryQuery = useGetCategories();
	useEffect(() => {
		if (create.data != undefined) {
			setCategory(create.data);
		} else if (update.data != undefined) {
			setCategory(update.data);
		}
	}, [create.data, update.data])
	useEffect(() => {
		const data = createItem.data || updateItem.data;
		if (data) {
			const item = categoryQuery.data?.find(x => x.id == data.categoryId);
			item && setCategory(item);
		}
	}, [categoryQuery.data, createItem.data, updateItem.data])

	if (pageQuery.isLoading || pageQuery.isError || categoryQuery.isLoading || categoryQuery.isError) {
		return <></>
	}
	const pages = pageQuery.data;
	const categories = categoryQuery.data;
	const categoriesGroup = groupByDistinct(categories, "id");
	const categoryNames: DropdownItem<number>[] = categories.map(x => ({name: x.name, id: x.id}))

	const onAdd = () => {
		const newCategory: TimelineCategory = {
			id: -1,
			name: 'New Category',
			pageId: pages[0]?.id || '',
			items: [],
			color: '#f1635c'
		}
		setCategory(newCategory);
	}

	const onSave = (isNew: boolean) => {
		if (!category) {
			return;
		}
		
		isNew ? create.mutate(category) : update.mutate(category);
	}

	const onClear = () => {
		setCategory(undefined);
	}

	const onDelete = (isNew: boolean) => {
		if (category && !isNew) {
			deletem.mutate(category.id);
			setCategory(undefined);
		}
	}

	const onChange: ItemAction<number> = (item) => {
		const category = categoriesGroup[item.id];
		setCategory(category);
	}

	const onPageChange: ItemAction<string> = (value) => {
		if (!category) return;
		changeProperty(category, "pageId", value.id);
	}

	const onPageRemove = () => {
		if (!category) return;
		changeProperty(category, "pageId", null);
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
			item.id > 0 && deleteItem.mutate(item.id);
			
			deleteMarkedForDelete(item.id);
		} else {
			copy[i] = item;
			item.id < 0 ? createItem.mutate(item) : updateItem.mutate(item);
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
			<EditItemsButtons items={categoryNames} value={category?.id} onChange={onChange}
				onAdd={onAdd} onSave={onSave} onClear={onClear} onDelete={onDelete}>
				{({isNew}) => (<>
					{category && <>
					<div className="my-2">
						<Input include={Label} label="Name" className="my-1" value={category.name} onChange={value => changeProperty(category, "name", value)}/>
						<Label label="Page" className="my-2">
							<RemoveField onRemove={onPageRemove} value={!!category?.pageId}>
								<Dropdown items={pages.map(x => ({name: x.url, id: x.id}))} initialValue={category?.pageId} onChange={onPageChange}>No page</Dropdown>
							</RemoveField>
						</Label>
						<Label label="Color" className="my-2">
							<ColorPicker value={category.color} onChange={(color) => changeProperty(category, 'color', color)}/>
						</Label>
					</div>
					<AddRemove items={category.items.map((item, i) => 
						<EditRestorationItem key={i} item={item} onSave={(item: RestorationTimelineItem) => saveItem(item, i)} 
							disabled={markedForDelete[item.id]} cancelDisabled={deleteMarkedForDelete} isNew={isNew}
						/>)}
						onAdd={onItemAdd} onDelete={onItemDelete}
					/>
					</>}
				</>)}
			</EditItemsButtons>
		</div>
	</>
}

type EditRestorationItemProps = {
	item: RestorationTimelineItem,
	onSave: (item: RestorationTimelineItem) => void,
	disabled?: boolean,
	cancelDisabled: (id: number) => void,
	isNew: boolean
}
const EditRestorationItem = ({item: propItem, disabled=false, onSave: onSaveProp, cancelDisabled, isNew}: EditRestorationItemProps) => {
	const [item, setItem] = useState<RestorationTimelineItem>(propItem);
	const [isDirty, setIsDirty] = useState(false);
	const changePropertyItem = useChangeProperty<RestorationTimelineItem>((item: RestorationTimelineItem) => {
		setIsDirty(true);
		setItem(item);
		if (isNew) {
			onSaveProp(item);
		}
	});
	useEffect(() => {
		if (propItem.id < 0) {
			setIsDirty(true);
		}
		setItem(propItem);
		
	}, [propItem])

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

	const onDateChange = (start: Date, end?: Date) => {
		const newItem = changePropertyItem(item, "date", start);
		end && changePropertyItem(newItem, "endDate", end);
	}

	const onDateRemove = () => {
		const newItem = changePropertyItem(item, "date", null);
		changePropertyItem(newItem, "endDate", null);
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
			<Label label="Date" className="inline-block my-1 mr-1">
				<RemoveField onRemove={onDateRemove} value={!!item.date}>
					<DateRangePicker start={item.date} end={item.endDate || item.date} onChange={onDateChange} />
				</RemoveField>
			</Label>
			<Input include={Label} label="Subcategory" className="my-1" value={item.subcategory || ''} inputClass="w-full" onChange={value => changePropertyItem(item, "subcategory", value || null)}/>
			<Label label="Links" className="my-1">
				<AddRemove items={item.links.map((link, i) => <Input key={i} value={link} inputClass="w-full" onChange={(value: string) => onLinkChange(value, i)}/>)}
					onAdd={onAddLink} onDelete={onDeleteLink}/>
			</Label>
			{!isNew && (isDirty || disabled) && <div className="my-1 text-right mx-4 z-20 relative">
				{item.id > 0 && <Button className="mx-1" mode="secondary" onClick={onCancel}>Cancel</Button>}
				<Button mode="primary" onClick={onSave}>Save</Button>
			</div>}
		</Panel>
	</>
}
