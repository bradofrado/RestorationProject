import { type GetServerSideProps, type GetServerSidePropsContext, type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import Button from "~/utils/components/base/button";
import Header from "~/utils/components/base/header";
import { Hyperlink } from "~/utils/components/base/hyperlink";
import Panel from "~/utils/components/base/panel";
import { ProfileIcon } from "~/utils/components/icons/icons";

const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session?.user) {
      return {
        redirect: {
          destination: "/login", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
};

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