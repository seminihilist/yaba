'use client';

import React from "react";

import {useAppSelector} from "@/lib/hooks";
import ItemOverviewWindow from "./ItemOverviewWindow";
import SectionOverviewWindow from "@/components/overview/SectionOverviewWindow";
import BudgetOverviewWindow from "@/components/overview/BudgetOverviewWindow";

/**
 * The overview window.
 * @param param0 The props of this component.
 * @constructor
 */
export default function OverviewWindow(
    {
        openID,
        setOpenID,
        openKind,
        setOpenKind,
        onClose,
    }: Readonly<{
        openID: number,
        setOpenID: (newOpenID: number) => unknown,
        openKind: 'budget' | 'section' | 'item',
        setOpenKind: (newOpenKind: 'budget' | 'section' | 'item') => unknown,
        onClose: () => unknown
    }>) {

    const budgets = useAppSelector((state) => state.app.budgets);
    const sections = useAppSelector((state) => state.app.sections);
    //const items = useAppSelector((state) => state.app.items);

    if (openKind === "budget") {
        if (!budgets[openID]) return (<></>);

        return (<BudgetOverviewWindow budget={budgets[openID]} />);
    } else if (openKind === "section") {
        if (!sections[openID]) {
            return (<></>); // TODO: close the overview window
        }

        return (<SectionOverviewWindow section={sections[openID]} onClose={onClose}/>);
    } else if (openKind === "item") {
        return (<ItemOverviewWindow openID={openID} setOpenID={setOpenID} openKind={openKind} setOpenKind={setOpenKind}
                                    onClose={onClose}/>);
    } else {
        return null;
    }
}
