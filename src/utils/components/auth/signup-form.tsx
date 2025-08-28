import Button from '~/utils/components/base/buttons/button';
import Input from '~/utils/components/base/input';
import Label from '~/utils/components/base/label';
import { useEffect, useState } from 'react';
import { type Signup } from '~/utils/types/auth';

type SignupFormComponentProps = {
  onSubmit: (user: Signup) => void;
  error?: string | null;
};
export const SignupForm = ({
  onSubmit: onSubmitProps,
  error: errorProps,
}: SignupFormComponentProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(errorProps ?? null);
  }, [errorProps]);

  const validate = () => {
    if (password != confirm) {
      setError('Password and confirm password must match');
      return false;
    }

    return true;
  };

  const onChange = (func: (val: string) => void) => {
    return (val: string) => {
      setError(null);
      func(val);
    };
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitProps({ name, email, password });
    }
  };
  return (
    <>
      <form className="" onSubmit={onSubmit}>
        <div className="mt-2">
          <Input
            include={Label}
            label="Name"
            inputClass="w-full block"
            required
            value={name}
            onChange={onChange(setName)}
          />
        </div>
        <div className="mt-2">
          <Input
            include={Label}
            type="email"
            label="Email"
            inputClass="w-full block"
            required
            value={email}
            onChange={onChange(setEmail)}
          />
        </div>
        <div className="mt-2">
          <Input
            include={Label}
            type="password"
            label="Password"
            inputClass="w-full block"
            required
            value={password}
            onChange={onChange(setPassword)}
          />
        </div>
        <div className="mt-2">
          <Input
            include={Label}
            type="password"
            label="Confirm Password"
            inputClass="w-full block"
            required
            value={confirm}
            onChange={onChange(setConfirm)}
          />
        </div>
        {error && <div className="mt-1 text-red-600">{error}</div>}
        <div className="mt-6">
          <Button mode="primary" className="w-full" type="submit">
            Sign up
          </Button>
        </div>
      </form>
    </>
  );
};
