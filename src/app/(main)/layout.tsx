import type {Metadata} from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import React from "react";
import {verifyAuthCookie} from "@/lib/auth";
import {Effect as E, pipe} from "effect";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "YABA",
    description: "Yet Another Budgeting App",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const verificationResult = await isAuthenticated();
    if (!verificationResult) {
        // If we aren't properly signed in, redirect the user to the login page
        // TODO: show some notification/toast/snackbar
        redirect('/login');
    }

    return (
        <StoreProvider>{children}</StoreProvider>
    );
}

const isAuthenticated = (): Promise<boolean> => E.runPromise(pipe(
    verifyAuthCookie,
    E.match({
        onSuccess: () => true,
        // TODO: log failure errors that imply something is wrong
        onFailure: () => false,
    }),
))