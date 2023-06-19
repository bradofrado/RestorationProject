import React from "react"
import {Navbar} from '~/utils/components/page/navbar';

export const Layout = ({children}: React.PropsWithChildren) => {
    return <>
        <div className="container flex flex-col px-4 mx-auto h-full flex-1">
            <Navbar/>
            {children}
        </div>
    </>
}