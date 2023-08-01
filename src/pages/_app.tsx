import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Notification from '@/components/notification';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700'] });

export default function App({ Component, pageProps }: AppProps) {
  const session = pageProps.session;

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Fitbau</title>
        <meta name="description" content="FITBAU - Your personal gym assistant for successful training" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`bg-base-100" ${roboto.className}`}>
        <Notification />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
