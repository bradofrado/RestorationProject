import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ServiceContainer } from "~/utils/react-service-container";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { HomeService } from "./services/HomeService";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
			<ServiceContainer providers={[HomeService]}>
      	<Component {...pageProps} />
			</ServiceContainer>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
