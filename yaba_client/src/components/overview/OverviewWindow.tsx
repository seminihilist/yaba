'use client';

import React from "react";

import {useAppDispatch, useAppSelector} from "@/lib/hooks";
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
        onClose: (newIsOpen: boolean) => unknown
    }>) {

    const budgets = useAppSelector((state) => state.app.budgets);
    const sections = useAppSelector((state) => state.app.sections);
    const items = useAppSelector((state) => state.app.items);
    const transactions = useAppSelector((state) => state.app.transactions);

    const dispatch = useAppDispatch();

    if (openKind === "budget") {
        if (!budgets[openID]) return (<></>);

        return (<BudgetOverviewWindow budget={budgets[openID]} setIsOpen={onClose}/>);
    } else if (openKind === "section") {
        if (!sections[openID]) {
            return (<></>); // TODO: close the overview window
        }

        return (<SectionOverviewWindow section={sections[openID]} setIsOpen={onClose}/>);
    } else if (openKind === "item") {
        return (<ItemOverviewWindow openID={openID} setOpenID={setOpenID} openKind={openKind} setOpenKind={setOpenKind}
                                    setIsOpen={onClose}/>);
    } else {
        return null;
    }
}
