import { ProfileButton } from '../auth/profile-button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { getServerAuthSession } from '~/server/auth';

export const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <>
      <div className="flex h-20 items-center justify-between">
        <div>
          <Link href="/">Witnesses of the Restoration</Link>
        </div>
        <div className="">
          {session?.user ? (
            <ProfileButton />
          ) : (
            <button onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </div>
    </>
  );
};
