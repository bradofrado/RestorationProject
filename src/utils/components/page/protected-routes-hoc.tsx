import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { type FC } from 'react';
import { getServerAuthSession } from '~/server/auth';
import { type UserRole } from '~/utils/types/auth';
import { isNotRole } from '~/utils/utils';
import { redirect as redirectNext } from 'next/navigation';

type RequireRouteProps = {
  redirect: string;
  check?: (session: Session) => boolean;
};
export const requireRoute =
  ({ redirect, check }: RequireRouteProps) =>
  (Component: FC<{ session: Session }>) =>
    async function ComponentWithSession() {
      const session = await getServerAuthSession();

      if (!session?.user || (check && check(session))) {
        redirectNext(redirect);
      }

      return <Component session={session} />;
    };

export const requireAuth = requireRoute({ redirect: '/login' });

export const requireRole = (role: UserRole) =>
  requireRoute({
    redirect: '/',
    check: isNotRole(role, (session) => session.user.role),
  });

export const defaultGetServerProps: GetServerSideProps = () =>
  new Promise((resolve) => resolve({ props: {} }));
