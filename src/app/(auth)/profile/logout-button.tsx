'use client';

import { signOut } from 'next-auth/react';
import { Hyperlink } from '~/utils/components/base/hyperlink';

export const LogoutButton = () => {
  return <Hyperlink onClick={() => void signOut()}>Logout</Hyperlink>;
};
