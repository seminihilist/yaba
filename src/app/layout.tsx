import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import type {Metadata} from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import React from "react";

export const metadata: Metadata = {
    title: "YABA",
    description: "Yet Another Budgeting App",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={'bg-amber-100'}>
            <body
                className={`antialiased bg-amber-100`}
            >
                <AppRouterCacheProvider options={{enableCssLayer: true}}>
                    <StoreProvider>{children}</StoreProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
