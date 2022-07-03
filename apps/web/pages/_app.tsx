import "../styles/globals.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { Slide, ToastContainer } from "react-toastify";
import { styles } from "../mantine/styles";
import { theme } from "../mantine/theme";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient as createQueryClient } from "../lib/query-client";
import { SocketProvider } from "../modules/socket/SocketProvider";
import { SocketHandler } from "../modules/socket/SocketHandler";

if (!process.env.NEXT_PUBLIC_API_URL)
  throw new Error("where NEXT_PUBLIC_API_URL at?");

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({ Component, pageProps }) => {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        styles={styles}
        theme={theme}
      >
        <SocketProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            pauseOnFocusLoss
            transition={Slide}
            limit={3}
          />
          <SocketHandler />
        </SocketProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
