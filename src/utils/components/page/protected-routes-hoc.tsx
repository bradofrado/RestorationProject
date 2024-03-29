import {type GetServerSideProps, type GetServerSidePropsContext} from 'next';
import { type Session } from 'next-auth';
import {getServerAuthSession} from '~/server/auth';
import {type UserRole} from '~/utils/types/auth';
import { isNotRole } from '~/utils/utils';

type RequireRouteProps = {
    redirect: string,
    check?: (session: Session) => boolean
}
export const requireRoute = ({redirect, check}: RequireRouteProps) => 
    (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session?.user || (check && check(session))) {
      return {
        redirect: {
          destination: redirect, // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
};


export const requireAuth = requireRoute({redirect: '/login'});

export const requireRole = (role: UserRole) => requireRoute({redirect: '/', check: isNotRole(role, (session) => session.user.role)});

export const defaultGetServerProps: GetServerSideProps = () => new Promise((resolve) => resolve({props: {}}))
