import { signIn, useSession } from "next-auth/react"
import { ProfileButton } from "../auth/profile-button"

interface HeaderComponentProps {

}
export const Navbar = ({}: HeaderComponentProps) => {
    const {data} = useSession();
    return <>
        <div className="flex justify-between items-center h-20">
            <div>
                Witnesses of the Restoration
            </div>
            <div className="">
               {data?.user ? <ProfileButton/> :
               <button onClick={() => void signIn()}>Sign in</button>}
            </div>
        </div>
    </>
}