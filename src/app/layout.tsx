import React, {ReactNode} from "react";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";

export default function AppLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className={'bg-amber-100'}>
        <body className={`antialiased bg-amber-100`}>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
          {children}
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}