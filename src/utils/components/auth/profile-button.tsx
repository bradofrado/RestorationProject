import Link from 'next/link';
import { ProfileIcon } from '~/utils/components/icons/icons';

export const ProfileButton = () => {
  return (
    <>
      <Link href="/profile">
        <ProfileIcon className="h-8 w-8" />
      </Link>
    </>
  );
};
