import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import NavigationContainer from "@/components/NavigationContainer";
import StoreProvider from "@/components/StoreProvider";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-100`}
        >
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <StoreProvider>{children}</StoreProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
