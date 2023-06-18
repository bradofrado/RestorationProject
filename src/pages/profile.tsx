import { GetServerSideProps, GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { Hyperlink } from "~/utils/components/base/hyperlink";

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
    return {props: {}}
});

const Profile_page: NextPage = () => {
    const {data} = useSession();
    if (!data) {
        return <></>
    }

    return <>
        Hello {data.user.name}
        <Hyperlink onClick={() => void signOut()}>Logout</Hyperlink>
    </>
}


export default Profile_page;