'use client';

import { signIn } from 'next-auth/react';

export const SigninButton = () => {
  return <button onClick={() => void signIn()}>Sign in</button>;
};
