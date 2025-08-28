import Button from '~/utils/components/base/buttons/button';
import Header from '~/utils/components/base/header';
import { Hyperlink } from '~/utils/components/base/hyperlink';
import Panel from '~/utils/components/base/panel';
import { ProfileIcon } from '~/utils/components/icons/icons';
import { requireAuth } from '~/utils/components/page/protected-routes-hoc';
import { isNotRole } from '~/utils/utils';
import { LogoutButton } from './logout-button';

const Profile_page = requireAuth(({ session }) => {
  const isNotEdit = isNotRole('edit');

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Panel className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 py-10">
            <ProfileIcon className="h-10 w-10" />
            <Header className="pt-5">{session.user.name}</Header>
            <p>{session.user.email}</p>
            {!isNotEdit(session.user.role) && (
              <Button as={Hyperlink} href="/edit">
                Edit Pages
              </Button>
            )}
            <LogoutButton />
          </div>
        </Panel>
      </div>
    </>
  );
});

export default Profile_page;
