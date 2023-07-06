import {useEffect, useState} from 'react';
import Dropdown from '~/utils/components/base/dropdown';
import {type ItemAction, type DropdownItem} from '~/utils/components/base/dropdown';
import {useGetPages} from '~/utils/services/EventPageService';
import {useCategoryMutations, useGetCategories, useTimelineMutations} from '~/utils/services/TimelineService';
import {type RestorationTimelineItem, type TimelineCategory} from '~/utils/types/timeline';
import {useChangeProperty, groupByDistinct} from '~/utils/utils';
import Panel from '~/utils/components/base/panel';
import AddRemove, { AddRemoveEditable } from '~/utils/components/base/addremove';
import Input from '~/utils/components/base/input';
import EditItemsButtons from '~/utils/components/edit/edit-items-buttons';
import Label from '~/utils/components/base/label';
import ColorPicker from '~/utils/components/base/color-picker';
import {DateRangePicker} from '~/utils/components/base/calendar/date-picker';
import { RemoveField } from '../base/remove-field';
import { type EditableComponentProps } from './editable';

export const EditTimelineItems = () => {
	const [category, setCategory] = useState<TimelineCategory>();
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

		const copy = category.items.slice();
		copy.splice(i, 1);
		item.id > 0 && deleteItem.mutate(item.id);
		changeProperty(category, "items", copy);
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
		copy[i] = item;
		item.id < 0 ? createItem.mutate(item) : updateItem.mutate(item);
		changeProperty(category, "items", copy);
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
					<AddRemoveEditable items={category.items.map((item, i) => ({component: EditRestorationItem, id: item.id.toString(), props: {
							data: item, 
							onEdit: (item: RestorationTimelineItem) => saveItem(item, i),
							onDelete: () => onItemDelete(i)
						}}))}
						onAdd={onItemAdd} isDirty={!isNew} isNewItem={item => item.id < 0}
					/>
					</>}
				</>)}
			</EditItemsButtons>
		</div>
	</>
}

type EditRestorationItemProps = EditableComponentProps<RestorationTimelineItem>
const EditRestorationItem = ({data: propItem, onEdit: onSaveProp}: EditRestorationItemProps) => {
	const changePropertyItem = useChangeProperty<RestorationTimelineItem>(onSaveProp);

	const onLinkChange = (value: string, i: number) => {
		const links = propItem.links;
		links[i] = value;
		changePropertyItem(propItem, "links", links);
	}

	const onAddLink = () => {
		const links = propItem.links.slice();
		links.push("new link");
		changePropertyItem(propItem, "links", links);
	}

	const onDeleteLink = (i: number) => {
		const links = propItem.links.slice();
		links.splice(i, 1);
		changePropertyItem(propItem, "links", links);
	}

	const onDateChange = (start: Date, end?: Date) => {
		const newItem = changePropertyItem(propItem, "date", start);
		end && changePropertyItem(newItem, "endDate", end);
		end && changePropertyItem(newItem, "endDate", end);
	}

	const onDateRemove = () => {
		const newItem = changePropertyItem(propItem, "date", null);
		changePropertyItem(newItem, "endDate", null);
	}
	return <>
		<Panel className="my-1" role="editable-timeline-item">
			<Input include={Label} label="Text" type="textarea" value={propItem.text} inputClass="w-full" onChange={value => changePropertyItem(propItem, "text", value)}/>
			<Label label="Date" className="inline-block my-1 mr-1">
				<RemoveField onRemove={onDateRemove} value={!!propItem.date}>
					<DateRangePicker start={propItem.date} end={propItem.endDate || propItem.date} onChange={onDateChange} />
				</RemoveField>
			</Label>
			<Input include={Label} label="Subcategory" className="my-1" value={propItem.subcategory || ''} inputClass="w-full" onChange={value => changePropertyItem(propItem, "subcategory", value || null)}/>
			<Label label="Links" className="my-1">
				<AddRemove items={propItem.links.map((link, i) => ({id: link, component: Input, props: {value:link, inputClass: "w-full", onChange: (value: string) => onLinkChange(value, i)}}))}
					onAdd={onAddLink} onDelete={onDeleteLink}/>
			</Label>
		</Panel>
	</>
}
