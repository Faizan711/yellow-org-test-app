import {
    isBrowser,
    OrderBookWidget,
    OrderFormWidget,
    Tab,
    toggleMobileDevice,
    useAppDispatch,
    useSetMobileDevice,
} from '@openware/neodax-web-sdk'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

const TradingChart = dynamic(() => import('@openware/neodax-web-sdk'), {
    ssr: false,
})

export const ChartAndOrderBookWidget = () => {
    const intl = useIntl()

    const [orderFormInFocus, setOrderFormInFocus] = useState<boolean>(false)
    const [blurHeight, setBlurHeight] = useState(0)
    const [blurClassName, setBlurClassName] = useState('')
    const [orderformWrapperClassName, setOrderformWrapperClassName] =
        useState('')
    const dispatch = useAppDispatch()

    const translate = useCallback(
        (id: string, value?: any) => intl.formatMessage({ id }, { ...value }),
        [],
    )

    const navigationTabsArray = useMemo(() => {
        return [
            {
                name: 'Orderbook',
                label: translate('page.body.trade.orderbook'),
            },
            {
                name: 'Chart',
                label: translate('page.body.charts.tabs.chart'),
            },
        ]
    }, [])

    const [selectedTab, setSelectedTab] = useState<any>(navigationTabsArray[0])

    const handleTabSelect = useCallback(
        (tab: string) => {
            const navigation =
                navigationTabsArray.find(
                    (n) => n.label.toLowerCase() === tab.toLowerCase(),
                ) || navigationTabsArray[0]
            setSelectedTab(navigation)
        },
        [navigationTabsArray],
    )

    const TAB_CONTENT = [
        translate('page.body.trade.orderbook'),
        translate('page.body.charts.tabs.chart'),
    ]

    const TAB_CONTENT_PROPS = {
        tabsContent: TAB_CONTENT,
        selectedContent: selectedTab.label,
        basicClassName:
            'w-6/12 py-2 active:bg-primary-cta-layer-color-20 duration-200 text-sm inline-flex justify-center items-center relative bg-neutral-control-color-40 text-neutral-control-layer-color-60',
        selectedClassName:
            'w-6/12 py-2 active:bg-primary-cta-layer-color-20 duration-200 text-sm inline-flex justify-center relative text-primary-cta-color-60 bg-primary-cta-layer-color-20',
        mainClassName:
            'relative z-0 border-t border-b border-divider-color-20 w-full flex justify-center items-center h-1/12',
        onClick: handleTabSelect,
    }

    useEffect(() => {
        if (typeof window != 'undefined') {
            window.addEventListener('resize', handleResize)
            dispatch(toggleMobileDevice(window.innerWidth <= 567))
            setBlurHeight(
                window.innerHeight -
                    (document.getElementById('orderform-mobile')
                        ?.offsetHeight || 0),
            )
        }

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [typeof window])

    useEffect(() => {
        setBlurClassName(
            classnames(
                'absolute top-0 w-screen blur bg-gray-500 bg-opacity-20 z-20 h-full webkitBlur',
                orderFormInFocus ? 'block' : 'hidden',
            ),
        )

        setOrderformWrapperClassName(
            classnames(
                'w-full z-20 bg-main-background-color h-auto',
                orderFormInFocus ? 'bottom-16 fixed' : 'bottom-0 pb-4',
            ),
        )
    }, [orderFormInFocus])

    const handleResize = () => {
        dispatch(toggleMobileDevice(window.innerWidth <= 567))
        setBlurHeight(
            window.innerHeight -
                (document.getElementById('orderform-mobile')?.offsetHeight ||
                    0),
        )
    }

    const getOrderbookHeight = useCallback(() => {
        if (!isBrowser()) {
            return 0
        }

        /**
         * 514=310+64+64+36+40 - height of not orderbook components
         */
        return window.innerHeight - 514
    }, [isBrowser()])

    const [orderbookHeight, setOrderbookHeight] = useState(300)

    useEffect(() => {
        window.addEventListener('orderFormOnFocus', () => {
            setTimeout(() => setOrderFormInFocus(true))
        })
        window.addEventListener('orderFormUnFocus', () => {
            setTimeout(() => setOrderFormInFocus(false))
        })
        window.addEventListener('resize', () => {
            setOrderbookHeight(getOrderbookHeight())
        })
        setOrderbookHeight(getOrderbookHeight())
    }, [getOrderbookHeight])

    const isVerticalMobileDevice = useSetMobileDevice()
    const isHorizontalMobileDevice = useSetMobileDevice(true)

    const renderTabContent = useCallback(
        (tab: string) => {
            switch (tab) {
                case 'Orderbook':
                    // 515=310+64+64+36+40 - height of not orderbook components
                    return (
                        <div style={{ height: orderbookHeight }}>
                            <OrderBookWidget
                                bottomSpace={515}
                                isMobile={
                                    isVerticalMobileDevice ||
                                    isHorizontalMobileDevice
                                }
                            />
                        </div>
                    )
                case 'Chart':
                    return (
                        <div style={{ height: orderbookHeight }}>
                            <TradingChart />
                        </div>
                    )
                default:
                    null
            }
        },
        [
            selectedTab,
            orderbookHeight,
            isVerticalMobileDevice,
            isHorizontalMobileDevice,
        ],
    )

    return (
        <>
            <div
                className={blurClassName}
                style={{
                    height: blurHeight,
                    backdropFilter: 'blur(4px)',
                }}
            />
            {renderTabContent(selectedTab.name)}
            <Tab {...TAB_CONTENT_PROPS} />
            <div id="orderform-mobile" className={orderformWrapperClassName}>
                <OrderFormWidget />
            </div>
        </>
    )
}
