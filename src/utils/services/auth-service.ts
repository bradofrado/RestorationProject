import { signIn } from "next-auth/react";
import { api } from "../api"

export const useSignup = () => {
    const query = api.auth.signup.useMutation({
        onSuccess: (_, variables) => {
            void signIn('credentials', {
                email: variables.email,
                password: variables.password,
                redirect: true,
                callbackUrl: "/profile"
            });
        }
    });

    return query;
}