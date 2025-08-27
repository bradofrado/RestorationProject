import { type NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { SignupForm } from '~/utils/components/auth/signup-form';
import Header from '~/utils/components/base/header';
import { Hyperlink } from '~/utils/components/base/hyperlink';
import { useSignup } from '~/utils/services/auth-service';
import { type Signup } from '~/utils/types/auth';

const Signup_page: NextPage = () => {
  const query = useSignup();
  const [error, setError] = useState<string | null>(null);

  if (query.isError && !error) {
    setError(
      'There was an error with your signup, please check your inputs and try again'
    );
  }

  const onSubmit = (user: Signup) => {
    query.mutate(user);
    //setUser(user);
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Header level={1} className="mt-10 text-center">
            Sign up for an account
          </Header>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <SignupForm onSubmit={onSubmit} error={error} />
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?
            <Hyperlink onClick={() => void signIn()}> Login now</Hyperlink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup_page;
