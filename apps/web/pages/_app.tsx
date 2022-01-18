import "../styles/globals.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { GlobalStyles, MantineProvider, NormalizeCSS } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { Slide, ToastContainer } from "react-toastify";
import { styles } from "../mantine/styles";
import { theme } from "../mantine/theme";
import { QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient as createQueryClient } from "../lib/query-client";
import { SocketProvider } from "../modules/socket/SocketProvider";
import { SocketHandler } from "../modules/socket/SocketHandler";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("where NEXT_PUBLIC_API_URL at?");
}

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps.dehydrateState}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>

        <MantineProvider styles={styles} theme={theme}>
          <SocketProvider>
            <NormalizeCSS />
            <GlobalStyles />
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              newestOnTop={true}
              closeOnClick
              pauseOnHover
              pauseOnFocusLoss
              transition={Slide}
              limit={8}
            />
            <SocketHandler />
          </SocketProvider>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
