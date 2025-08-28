'use client';

import { type NextPage } from 'next';
import { LoginForm } from '~/utils/components/auth/login-form';
import Header from '~/utils/components/base/header';
import { Hyperlink } from '~/utils/components/base/hyperlink';
import { signIn } from 'next-auth/react';
import { type Login } from '~/utils/types/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login_page: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (user: Login) => {
    const result = await signIn('credentials', {
      ...user,
      redirect: false,
    });

    if (result?.ok) {
      void router.push('/timeline');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Header level={1} className="mt-10 text-center">
            Sign in to your account
          </Header>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm
            onSubmit={(user) => void onSubmit(user)}
            error={error}
            resetError={() => setError(null)}
          />
          <p className="mt-10 text-center text-sm text-gray-500">
            Don&#39;t have an account?
            <Hyperlink href="/signup"> Sign up now</Hyperlink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login_page;
