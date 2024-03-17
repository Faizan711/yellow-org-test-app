import { useSetMobileDevice, withClearportAuth, appTitle } from "@openware/neodax-web-sdk";
import classnames from "classnames";
import { useIntl } from "react-intl";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo } from "react";
import Head from "next/head";
import { posthog } from "posthog-js";

const TradeHistory = dynamic(() => import("@openware/neodax-web-sdk").then((mod: any) => mod.TradeHistory), {
    ssr: false,
});

const TradeHistoryList: React.FC = () => {
    const intl = useIntl();
    const isMobile = useSetMobileDevice(false, 655);

    const wrapperClassName = classnames("flex flex-col w-full h-full pb-16", {
        "p-6": !isMobile,
        "overflow-y-auto": isMobile,
    });

    const translate = useCallback((id: string, value?: any) => intl.formatMessage({ id }, { ...value }), []);

    useEffect(() => {
        const pageViewData = {
            type: "paveView",
            name: "history_trade_view",
        };

        posthog?.capture("page_view", pageViewData);
    }, []);

    return (
        <>
            <Head>
                <title>{appTitle(translate("page.body.history.tab.tradehistory"))}</title>
            </Head>
            <div className={wrapperClassName}>
                <TradeHistory />
            </div>
        </>
    );
};

export default withClearportAuth(TradeHistoryList);
