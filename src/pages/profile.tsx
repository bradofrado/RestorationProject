import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Header from "~/utils/components/base/header";
import { Hyperlink } from "~/utils/components/base/hyperlink";
import Panel from "~/utils/components/base/panel";
import { ProfileIcon } from "~/utils/components/icons/icons";
import { requireAuth } from "~/utils/components/page/protected-routes-hoc";

export const getServerSideProps = requireAuth(() => {
    return new Promise((resolve) => resolve({props: {}}));
});

const Profile_page: NextPage = () => {
    const {data} = useSession();
    if (!data) {
        return <></>
    }

    return <>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <Panel className="mx-auto max-w-md w-full">
                <div className="py-10 flex flex-col items-center space-y-2">
                    <ProfileIcon className="h-10 w-10"/>
                    <Header className="pt-5">{data.user.name}</Header>
                    <p>{data.user.email}</p>
                    <Hyperlink onClick={() => void signOut()}>Logout</Hyperlink>
                </div>
            </Panel>
        </div>
    </>
}


export default Profile_page;