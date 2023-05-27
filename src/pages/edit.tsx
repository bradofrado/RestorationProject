import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddComponent, { type ComponentType, CustomComponent } from "~/utils/components/AddComponent";
import Dropdown, { type DropdownItem } from "~/utils/components/Dropdown";
import Editable from "~/utils/components/Editable";
import useEventPages from "~/utils/services/EventPageService";
import  { useEventPagesMutation } from "~/utils/services/EventPageService";
import { type EventPage, type ComponentSettings, type EditableData } from "~/utils/types/page";

const Edit_page: NextPage = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState<EventPage>();
	const [isNew, setIsNew] = useState(true);
	const {create, update, deletem} = useEventPagesMutation();
	const query = useEventPages();

	const {id} = router.query;
	let pages: EventPage[] | null = null;

	useEffect(() => {
		if (query.data && typeof id == 'string') {
			const page = query.data.find(x => x.id == id);
			console.log(page);
			page && setCurrPage(page);
			setIsNew(false);
		}
		console.log(id);
		console.log(query.data)
	}, [id, query.data])

	if (query.isLoading || !router.isReady) {
		return <div>Loading...</div>
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>
	}

	const setRoute = (id: string | undefined) => {
		id ? void router.push(`${router.basePath}?id=${id}`) : void router.push(`${router.basePath}`);
	}

	pages = query.data;
	const items: DropdownItem[] = pages.map(page => ({label: page.url, handler: i => {
		setRoute(page.id);
		setCurrPage(pages && pages[i] || undefined);
		setIsNew(false);
	}}));

	const onAddPage = () => {
		setCurrPage({id: '', url: "book-of-mormon", title: "Book of Mormon Translation", description: "Text", settings: []});
		setIsNew(true);
	}

	const onSave = () => {
		if (currPage) {
			isNew ? create(currPage) : update(currPage)
			setIsNew(false);
			setRoute(currPage.id);
			alert("Page saved!")
		}
	}

	const onDelete = () => {
		if (currPage && !isNew) {
			deletem(currPage.id);
			setCurrPage(undefined);
			setRoute(undefined);
		}
	}

	const onClear = () => {
		setCurrPage(undefined);
		setIsNew(false);
	}

	const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currPage == undefined) return;
		const copy: EventPage = {...currPage};
		copy.url = e.target.value;
		setCurrPage(copy);
	}

	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 my-10">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<div>
				<Dropdown items={items}>{currPage?.url ?? 'select page'}</Dropdown>
				<span className="mx-1">
					{currPage == undefined ? 
						<Button onClick={onAddPage} mode="secondary">Add Page</Button> : 
						(<>
							<Button className="mr-1" onClick={onSave}>Save</Button>
							{!isNew && <Button className="mr-1" onClick={onDelete} mode="secondary">Delete</Button>}
							<Button onClick={onClear} mode="secondary">Clear</Button>
						</>)}
				</span>
			</div>
			{currPage && <>
				<div className="py-1">
					<label>Url:</label>
					<input className="ml-1 bg-black bg-opacity-20 inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
						value={currPage.url} onChange={onNameChange}
					/>
					<Link href={`/${currPage.url}`} className="ml-1 bg-black bg-opacity-20 inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">Go</Link>
				</div>
				<EditPage page={currPage} setPage={setCurrPage} />
				</>}
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

const EditPage = ({page, setPage}: {page: EventPage, setPage: (page: EventPage) => void}) => {
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