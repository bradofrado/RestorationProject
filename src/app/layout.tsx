import { Suspense } from 'react';
import '~/styles/globals.css';
import { QueryStateProvider } from '~/utils/components/hooks/query-state';
import { LocalizationProvider } from '~/utils/localization';
import { ServiceContainer } from '~/utils/react-service-container';
import { TrpcProvider } from '~/utils/trpc';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Suspense>
          <QueryStateProvider>
            <TrpcProvider>
              <ServiceContainer providers={[]}>
                <LocalizationProvider>{children}</LocalizationProvider>
              </ServiceContainer>
            </TrpcProvider>
          </QueryStateProvider>
        </Suspense>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Witnesses of the Restoration',
  description: 'Witnesses of the Restoration',
};
