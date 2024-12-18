/* eslint-disable @typescript-eslint/unbound-method */
import "@mantine/core/styles.css";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { Slide, ToastContainer } from "react-toastify";
import { theme } from "../mantine/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "../modules/socket/socket-provider";
import { SocketHandler } from "../modules/socket/socket-handler";
import type { AppProps } from "next/app";
import { api } from "../lib/api";
import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";

if (!process.env.NEXT_PUBLIC_API_URL)
  throw new Error("where NEXT_PUBLIC_API_URL at?");

dayjs.extend(relativetime);

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60 * 1000 * 5,
            retryOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            queryFn: async ({ queryKey }) =>
              (await api.get<unknown>(`${queryKey[0]}`)).data
          },
          mutations: {
            retry: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={client}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider theme={theme}>
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
