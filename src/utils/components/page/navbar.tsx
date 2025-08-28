import { signIn, useSession } from 'next-auth/react';
import { ProfileButton } from '../auth/profile-button';
import Link from 'next/link';

export const Navbar = () => {
  const { data } = useSession();
  return (
    <>
      <div className="flex h-20 items-center justify-between">
        <div>
          <Link href="/">Witnesses of the Restoration</Link>
        </div>
        <div className="">
          {data?.user ? (
            <ProfileButton />
          ) : (
            <button onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </div>
    </>
  );
};
