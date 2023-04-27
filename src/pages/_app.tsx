import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ServiceContainer } from "~/utils/react-service-container";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { TimelineService } from "~/utils/components/Timeline/TimelineService";
import EventPageService from "~/utils/components/event-page/EventPageService";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
			<ServiceContainer providers={[TimelineService, EventPageService]}>
				<Head>
					<title>Witnesses of the Restoration</title>
					<meta name="description" content="Generated by create-t3-app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main className="flex min-h-screen flex-col bg-gradient-to-b from-[#F2F4Fa] to-[#F2F4Fa]">
					<div className="container flex flex-col gap-12 px-4 mx-auto">
						<Component {...pageProps} />
					</div>
				</main>
			</ServiceContainer>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
