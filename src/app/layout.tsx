import '~/styles/globals.css';
import { LocalizationProvider } from '~/utils/localization';
import { ServiceContainer } from '~/utils/react-service-container';
import { TrpcProvider } from '~/utils/trpc';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TrpcProvider>
          <ServiceContainer providers={[]}>
            <LocalizationProvider>{children}</LocalizationProvider>
          </ServiceContainer>
        </TrpcProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Witnesses of the Restoration',
  description: 'Witnesses of the Restoration',
};
