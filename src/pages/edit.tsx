import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import AddComponent, { type onDeleteComponent } from "~/utils/components/AddComponent";
import Editable from "~/utils/components/Editable";

const Edit_page: NextPage = () => {
	const [components, setComponents] = useState<React.ElementType<onDeleteComponent>[]>([]);

	const onAdd = (component: React.ElementType<onDeleteComponent>) => {
		const copy = components.slice();
		copy.push(component);
		setComponents(copy);
	}

	const deleteComponent = (index: number) => {
		const copy = components.slice();
		copy.splice(index, 1);
		setComponents(copy);
	}
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 my-10">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<Editable as="h1" className="mx-auto text-3xl font-bold my-5 text-bom">
				Book of Mormon Translation
			</Editable>
			<Editable as="p">
				This is a description
			</Editable>
			{components.map((Component: React.ElementType<onDeleteComponent>, i: number) => <Component key={i} onDelete={() => deleteComponent(i)}/>)}
			<AddComponent onAdd={onAdd}/>
		</div>
	</>
}



export default Edit_page;