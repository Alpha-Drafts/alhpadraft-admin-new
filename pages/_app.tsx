import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/others/ErrorBoundary";
import { AppProviders } from "@/context";
import PrelineScriptWrapper from "@/components/PrelineScriptWrapper";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((_page: ReactElement) => <>{_page}</>);

  return (
    <div className={`${interSans.className}`}>
      <AppProviders>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ToastContainer />
          {getLayout(<Component {...pageProps} />)}
          <PrelineScriptWrapper />
        </ErrorBoundary>
      </AppProviders>
    </div>
  );
}
