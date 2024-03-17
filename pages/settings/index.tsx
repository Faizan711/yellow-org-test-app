import { appTitle, GitTag, LanguageSelectorWidget, useSetMobileDevice } from "@openware/neodax-web-sdk";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Head from "next/head";
import posthog from "posthog-js";
import { FC, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";

// @ts-ignore
const ThemeSwitcher = dynamic(() => import("@openware/neodax-web-sdk").then((mod) => mod.ThemeSwitcherWidget), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});

const SettingsPage: FC = () => {
    const intl = useIntl();

    const isMobile = useSetMobileDevice();

    const translate = useCallback((id: string, values?: any) => intl.formatMessage({ id }, values), [intl]);

    useEffect(() => {
        const pageViewData = {
            type: "paveView",
            name: "settings_view",
        };

        posthog?.capture("page_view", pageViewData);
    }, []);

    return (
        <>
            <Head>
                <title>{appTitle(translate("page.tab.header.settings"))}</title>
            </Head>
            <div
                className={classnames("flex flex-col h-full w-full p-6 bg-body-background-color", {
                    "pb-16 overflow-y-auto": isMobile,
                })}
            >
                <div className="border-b border-divider-color-20 pb-6">
                    <span className="text-text-color-100 text-2xl leading-8 font-semibold">
                        {translate("page.body.settings.header.label")}
                    </span>
                </div>
                <div className="border-b border-divider-color-20 py-4 flow-root">
                    <div className="float-left h-full flex items-center">
                        <span className="text-text-color-90 text-lg leading-6 font-medium">
                            {translate("page.body.settings.rows.language")}
                        </span>
                    </div>
                    <div className="float-right">
                        <LanguageSelectorWidget />
                    </div>
                </div>
                <div className="border-b border-divider-color-20 py-4 flow-root">
                    <div className="float-left h-full flex items-center">
                        <span className="text-text-color-90 text-lg leading-6 font-medium">
                            {translate("page.body.settings.rows.theme")}
                        </span>
                    </div>
                    <div className="float-right">
                        <ThemeSwitcher />
                    </div>
                </div>
                <GitTag />
            </div>
        </>
    );
};

export default SettingsPage;
