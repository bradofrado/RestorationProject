import { ProfileButton } from "../auth/profile-button"

interface HeaderComponentProps {

}
export const Navbar = ({}: HeaderComponentProps) => {
    return <>
        <div className="flex justify-between items-center h-20">
            <div>
                Witnesses of the Restoration
            </div>
            <div className="">
               <ProfileButton/>
            </div>
        </div>
    </>
}