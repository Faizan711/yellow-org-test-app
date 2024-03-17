import { YellowLogo } from "../../assets";
import {
    AccountCenter,
    Alerts,
    MarketSelectorWidget,
    Layout as SharedLayout,
    SidebarProps,
    SignChallengeTokenModal,
    navigation,
    navigationApp,
    navigationAppItem,
    navigationLoggedin,
    navigationMobile,
    useAppSelector,
} from "@openware/neodax-web-sdk";
import classnames from "classnames";
import { useRouter } from "next/router";
import { JSX, PropsWithChildren, useMemo } from "react";
import { useIntl } from "react-intl";
import ErrorBoundary from "../ErrorBoundary";

export function Layout(props: PropsWithChildren<{ className?: string; withoutLayout?: boolean }>): JSX.Element {
    const markets = useAppSelector((state) => state.markets.markets);
    const user = useAppSelector((state) => state.user.user);
    const currentMarket = useAppSelector((state) => state.markets.currentMarket);
    const colorTheme = useAppSelector((state: any) => state.globalSettings.color);
    const isLoggedin = useMemo(() => user?.isJwtExist, [user?.isJwtExist]);

    const intl = useIntl();
    const router = useRouter();

    const navigations = useMemo((): navigationApp[] => {
        const mainNavigation = isLoggedin ? navigationLoggedin : navigation;

        return [
            {
                app: "mainapp",
                pathnames: mainNavigation.map<navigationAppItem>((nav: navigationAppItem) => {
                    if (nav.submenus?.length) {
                        return {
                            ...nav,
                            name: intl.formatMessage({
                                id: `page.sidebar.navigation.${nav.name.toLowerCase()}`,
                            }),
                            submenus: nav.submenus.map((submenu: any) => {
                                return {
                                    ...submenu,
                                    name: intl.formatMessage({
                                        id: `page.sidebar.navigation.${nav.name.toLowerCase()}.submenu.${submenu.name.toLowerCase()}`,
                                    }),
                                };
                            }),
                        };
                    }

                    let path = nav.path;
                    if (nav.path === "/trading" && markets?.length) {
                        if (currentMarket) {
                            path = `${nav.path}/${currentMarket.id}`;
                        } else {
                            path = `${nav.path}/${markets[0].id}`;
                        }
                    }

                    return {
                        ...nav,
                        name: intl.formatMessage({
                            id: `page.sidebar.navigation.${nav.name.toLowerCase()}`,
                        }),
                        path,
                    };
                }),
            },
        ];
    }, [markets, intl, currentMarket, isLoggedin]);

    const mobileNavigation = useMemo((): navigationApp[] => {
        if (!navigationMobile) return [];

        return [
            {
                app: "mainapp",
                pathnames: navigationMobile.map<navigationAppItem>((nav: navigationAppItem) => {
                    if (nav.submenus?.length) {
                        return {
                            ...nav,
                            name: intl.formatMessage({
                                id: `page.sidebar.navigation.${nav.name.toLowerCase()}`,
                            }),
                            submenus: nav.submenus.map((submenu: any) => {
                                return {
                                    ...submenu,
                                    name: intl.formatMessage({
                                        id: `page.sidebar.navigation.${nav.name.toLowerCase()}.submenu.${submenu.name.toLowerCase()}`,
                                    }),
                                };
                            }),
                        };
                    }

                    return {
                        ...nav,
                        name: intl.formatMessage({
                            id: `page.sidebar.navigation.${nav.name.toLowerCase()}`,
                        }),
                        path:
                            nav.path === "/trading" && markets?.length
                                ? currentMarket
                                    ? `${nav.path}/${currentMarket.id}`
                                    : `${nav.path}/${markets[0].id}`
                                : nav.path,
                    };
                }),
            },
        ];
    }, [currentMarket, intl, markets]);

    const Logo = useMemo(
        () => (
            <YellowLogo
                classNames="focus:outline-none focus:ring-none"
                fillColor={colorTheme === "light" ? "#090909" : "#ffffff"}
            />
        ),
        [colorTheme]
    );

    const sidebarProps: SidebarProps = {
        currentApp: "mainapp",
        navigations,
        mobileNavigation,
        navOverlayClasses: "relative bg-navbar-background-color flex-1 flex flex-col max-w-[260px] pt-5 pb-4",
        classNames: "bg-navbar-background-color sm:border-r border-divider-color-20",
        bottomClasses:
            "fixed w-screen bottom-0 z-30 flex-shrink-0 md:hidden max-md:flex h-16 bg-navbar-background-color border-t border-divider-color-20 w-full left-0",
        navActiveClassNames: "bg-navbar-control-bg-color-10 text-navbar-control-layer-color-60",
        navGroupActiveClassNames: "bg-navbar-control-bg-color-10 rounded-lg text-navbar-control-layer-color-60",
        navInactiveClassNames: "text-neutral-control-layer-color-60 hover:bg-navbar-control-bg-color-10",
        isLoggedin: false,
        colorTheme,
        logo: Logo,
        buttonsList: [],
    };

    if (props.withoutLayout) {
        return props.children as JSX.Element;
    }

    return (
        <SharedLayout
            containerClassName={props.className}
            sidebarProps={sidebarProps}
            headerProps={{ show: false }}
            mainClassName={classnames(
                "flex-1 flex flex-col relative focus:outline-none",
                router.pathname.includes("/network") ? "overflow-hidden" : "overflow-y-auto"
            )}
            wrapperClassname={"flex flex-col w-0 flex-1 h-screen"}
        >
            <>
                <ErrorBoundary isAdmin={false}>
                    <Alerts />
                    {props.children}
                    <MarketSelectorWidget />
                    <AccountCenter />
                    <SignChallengeTokenModal />
                </ErrorBoundary>
            </>
        </SharedLayout>
    );
}
