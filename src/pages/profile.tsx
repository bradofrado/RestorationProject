import { type NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Button from '~/utils/components/base/buttons/button';
import Header from '~/utils/components/base/header';
import { Hyperlink } from '~/utils/components/base/hyperlink';
import Panel from '~/utils/components/base/panel';
import { ProfileIcon } from '~/utils/components/icons/icons';
import { requireAuth } from '~/utils/components/page/protected-routes-hoc';
import { isNotRole } from '~/utils/utils';

export const getServerSideProps = requireAuth(() => {
  return new Promise((resolve) => resolve({ props: {} }));
});

const Profile_page: NextPage = () => {
  const { data } = useSession();
  if (!data) {
    return <></>;
  }

  const isNotEdit = isNotRole('edit');

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Panel className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 py-10">
            <ProfileIcon className="h-10 w-10" />
            <Header className="pt-5">{data.user.name}</Header>
            <p>{data.user.email}</p>
            {!isNotEdit(data.user.role) && (
              <Button as={Hyperlink} href="/edit">
                Edit Pages
              </Button>
            )}
            <Hyperlink onClick={() => void signOut()}>Logout</Hyperlink>
          </div>
        </Panel>
      </div>
    </>
  );
};

export default Profile_page;
