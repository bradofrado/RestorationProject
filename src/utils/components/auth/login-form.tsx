import Button from '~/utils/components/base/button';
import Input from '~/utils/components/base/input';
import Label from '~/utils/components/base/label';
import { useState } from 'react';
import { type Login } from '~/utils/types/auth';
type LoginFormComponentProps = {
    error?: string | null, 
    onSubmit: (user: Login) => void,
    resetError: () => void
}
export const LoginForm = ({onSubmit: onSubmitProps, error, resetError}: LoginFormComponentProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitProps({email, password});
    }

    const onChange = (func: (val: string) => void) => {
        return (val: string) => {
            resetError();
            func(val);
        }
    }
    return <>
        <form className="space-y-6" onSubmit={onSubmit}>
            <div>
                <div className="mt-2">
                    <Input include={Label} label="Email address" inputClass="w-full block" required value={email} onChange={onChange(setEmail)}/>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    {/* <div className="text-sm">
                        <Hyperlink>Forgot password?</Hyperlink>
                    </div> */}
                </div>
                <div className="mt-1">
                    <Input inputClass="w-full block" type="password" required value={password} onChange={onChange(setPassword)}/>
                </div>
                {error && <div className="text-red-600 mt-1">{error}</div>}
            </div>
            <div>
                <Button mode="primary" className="w-full" type="submit">Sign in</Button>
            </div>
        </form>
    </>
}