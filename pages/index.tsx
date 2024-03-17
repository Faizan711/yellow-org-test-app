import { appTitle } from "@openware/neodax-web-sdk";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, JSX, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";

const Home: FC<{}> = (): JSX.Element => {
    const intl = useIntl();
    const router = useRouter();

    const translate = useCallback((id: string) => intl.formatMessage({ id }), [intl]);

    useEffect(() => {
        router.replace("/network");
    }, [router]);

    return (
        <Head>
            <title>{appTitle(translate("page.tab.header.home"))}</title>
        </Head>
    );
};

export default Home;
