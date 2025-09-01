import { ProfileButton } from '../auth/profile-button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { getServerAuthSession } from '~/server/auth';

interface NavItem {
  label: string;
  href: string;
}

export const Navbar = async () => {
  const session = await getServerAuthSession();
  const navItems: NavItem[] = [
    {
      label: 'Timeline',
      href: '/timeline',
    },
    {
      label: 'Map',
      href: '/map',
    },
    {
      label: 'Essays',
      href: '/essays',
    },
  ];
  return (
    <>
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="text-xl font-bold" href="/">
            Witnesses of the Restoration
          </Link>
          {navItems.map((item) => (
            <Link
              className="hover:text-gray-500"
              key={item.href}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
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
