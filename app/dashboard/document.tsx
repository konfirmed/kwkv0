// pages/_app.tsx

import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
