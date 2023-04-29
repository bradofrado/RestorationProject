import { type NextPage } from "next";
import Link from "next/link";
import { type FocusEvent, useState, useRef, useEffect, PropsWithChildren, DOMAttributes, InputHTMLAttributes } from "react";
import Editable from "~/utils/components/Editable";

const Edit_page: NextPage = () => {
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 my-10">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<Editable as="h1" className="hover:bg-sky-200/50 p-2 rounded-md mx-auto text-3xl font-bold my-5 text-bom">
				Book of Mormon Translation
			</Editable>
			<div>
				<Editable as="p" className="hover:bg-sky-200/50 p-2 rounded-md">
					This is a description
				</Editable>
			</div>
			<div className="py-10">
				<h2 className="text-xl font-bold">Timeline of Events</h2>
			</div>
		</div>
	</>
}

export default Edit_page;