import "@openware/neodax-web-sdk/index.css";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/globals.css";
import "../styles/scss/index.scss";

import { CoreProvider, appTitle, getConfigs } from "@openware/neodax-web-sdk";
import { JSX, useMemo } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Layout } from "../components";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    const router = useRouter();

    const favicon = useMemo(() => {
        const appLogos = getConfigs().appLogos;

        if (appLogos) {
            const newLogos = JSON.parse(appLogos);

            return newLogos?.favicon?.data?.publicUrl || "/favicon.ico";
        }

        return "/favicon.ico";
    }, [getConfigs()]);

    const layoutProps = useMemo(() => {
        if (router?.pathname == "/settings") {
            return {
                className: "overflow-y-auto no-scrollbar mb-6 md:flex md:flex-grow md:overflow-hidden md:mb-0",
            };
        }
        if (router?.pathname.includes("/settings")) {
            return {
                className: "overflow-y-auto no-scrollbar",
            };
        }
    }, [router?.pathname]);

    return (
        <>
            <Head>
                <link rel="icon" type="image/svg+xml" href={favicon} />
                <meta name="viewport" content="width=device-width, initial-scale=1" charSet="UTF-8" />
                <title>{appTitle()}</title>
            </Head>
            <CoreProvider>
                <PostHogProvider>
                    <div className="bg-main-background-color">
                        <Layout {...layoutProps}>
                            <Component {...pageProps} />
                        </Layout>
                    </div>
                </PostHogProvider>
            </CoreProvider>
        </>
    );
}
