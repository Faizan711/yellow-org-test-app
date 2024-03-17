import {
    appTitle,
    ClearportAccount,
    PeersMapWidget,
    PeersWithToggle,
    useSetMobileDevice,
} from "@openware/neodax-web-sdk";
import classnames from "classnames";
import Head from "next/head";
import { useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import posthog from "posthog-js";

const PeersPage: React.FC = () => {
    const intl = useIntl();

    const translate = useCallback((id: string) => intl.formatMessage({ id }), [intl]);

    useEffect(() => {
        const pageViewData = {
            type: "paveView",
            name: "network_view",
        };

        posthog?.capture("page_view", pageViewData);
    }, []);

    return (
        <>
            <Head>
                <title>{appTitle(translate("page.tab.header.network"))}</title>
            </Head>
            <div className={classnames("flex flex-col w-full bg-body-background-color h-screen")}>
                <div className="absolute right-0 mr-3 sm:mr-4 mt-[12px] sm:mt-[17px]">
                    <ClearportAccount
                        containerClassnames="pt-0.5 px-1.5 sm:px-3 rounded flex items-center justify-center"
                        userAddressContainerClassName="py-0.5 min-[450px]:pr-1.5 sm:pr-3 min-[450px]:border-r border-divider-color-20 font-medium text-[10px] leading-3 sm:text-xs sm:leading-4 text-text-color-100 whitespace-nowrap"
                        connectionStatusContainerClassName="flex items-center gap-1.5 sm:gap-2.5 text-[10px] leading-3 sm:text-xs capitalize sm:leading-4 whitespace-nowrap max-[450px]:hidden"
                    />
                </div>
                <PeersWithToggle />
                <PeersMapWidget />
            </div>
        </>
    );
};

export default PeersPage;
