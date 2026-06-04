'use client';

import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Budget} from "@/domain/types";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {addBudget, addItem, addSection, migrateBudget} from "@/store/app";
import {setHasCompletedSetup, setOpenBudget} from "@/store/user";
import SetupDialog from "@/components/setup/SetupDialog";

export default function NewBudgetWrapper({children}: Readonly<{
    children: (budget: Budget) => ReactNode
}>) {
    console.group("Children:")
    console.log(children)
    console.groupEnd()

    const dispatch = useAppDispatch();

    const budgets = Object.values(useAppSelector(state => state.app.budgets)).filter(budget => !!budget);

    const openBudget =
        useAppSelector(state => state.user.openBudget ? state.app.budgets[state.user.openBudget] : undefined);

    const [newBudgetDialogIsOpen, setNewBudgetDialogIsOpen] = useState(false);
    const openNewBudgetDialog = () => setNewBudgetDialogIsOpen(true);
    const closeNewBudgetDialog = () => setNewBudgetDialogIsOpen(false);

    const hasCheckedForNewMonth = useRef(false);

    const hasCompletedSetup = useAppSelector(state => state.user.hasCompletedSetup);
    const [setupDialogIsOpen, setSetupDialogIsOpen] = useState(false);
    const closeSetupDialog = () => setSetupDialogIsOpen(false);

    useEffect(() => {
        if (!hasCompletedSetup) {
            // TODO: extract creating this default budget into its own action in the store
            // TODO: offer a choice of multiple templates

            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0)

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setHours(0, 0, 0, 0)

            const {payload: {newId: newBudgetId}} = dispatch(addBudget({
                startTime: monthStart.getTime(),
                endTime: monthEnd.getTime()
            }));

            const {payload: {newId: revenueSectionId}} = dispatch(addSection({
                budgetID: newBudgetId as number,
                name: "Revenue",
            }));

            dispatch(addItem({
                sectionID: revenueSectionId as number,
                itemName: "Paycheck",
                itemAmount: 6000,
                kind: 'income',
            }));

            const {payload: {newId: fixedCostsSectionId}} = dispatch(addSection({
                budgetID: newBudgetId as number,
                name: "Fixed Costs",
            }));

            dispatch(addItem({
                sectionID: fixedCostsSectionId as number,
                itemName: "Mortgage",
                itemAmount: 2300,
                kind: 'expense',
            }));

            dispatch(addItem({
                sectionID: fixedCostsSectionId as number,
                itemName: "Transportation",
                itemAmount: 1000,
                kind: 'expense',
            }));

            const {payload: {newId: savingsAndInvestmentsSectionId}} = dispatch(addSection({
                budgetID: newBudgetId as number,
                name: "Savings and Investments",
            }));

            dispatch(addItem({
                sectionID: savingsAndInvestmentsSectionId as number,
                itemName: "Savings",
                itemAmount: 800,
                kind: 'expense',
            }));

            const {payload: {newId: necessitiesSectionId}} = dispatch(addSection({
                budgetID: newBudgetId as number,
                name: "Necessities",
            }));

            dispatch(addItem({
                sectionID: necessitiesSectionId as number,
                itemName: "Groceries",
                itemAmount: 1200,
                kind: 'expense',
            }));

            const {payload: {newId: spendingSection}} = dispatch(addSection({
                budgetID: newBudgetId as number,
                name: "Spending",
            }));

            dispatch(addItem({
                sectionID: spendingSection as number,
                itemName: "Eating Out",
                itemAmount: 350,
                kind: 'expense',
            }));

            dispatch(setOpenBudget({id: newBudgetId as number}));

            dispatch(setHasCompletedSetup({hasCompletedSetup: true}));

            setSetupDialogIsOpen(true);
        } else if (!openBudget) {
            // If the currently open budget has ceased to exist for whatever reason, change it to the most recent
            // budget.
            dispatch(setOpenBudget({
                id: budgets.toSorted((left, right) => right.startTime - left.startTime)[0].id,
            }))
        } else if (!hasCheckedForNewMonth.current) {
            const now = Date.now();

            if (openBudget.state === 'active' && now > openBudget.endTime) {
                const monthStart = new Date();
                monthStart.setDate(1);
                monthStart.setHours(0, 0, 0, 0)

                const monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthEnd.getMonth() + 1);
                monthEnd.setHours(0, 0, 0, 0)

                // We've passed the end time of the current budget
                const {payload: {newId}} = dispatch(migrateBudget({
                    id: openBudget.id,
                    newStartTime: monthStart.getTime(),
                    newEndTime: monthEnd.getTime(),
                }));

                dispatch(setOpenBudget({id: newId as number}));

                openNewBudgetDialog();
            }

            hasCheckedForNewMonth.current = true;
        }
    }, [hasCompletedSetup, openBudget, dispatch, budgets]);

    const budget2 = useAppSelector(state => state.user.openBudget != null ? state.app.budgets[state.user.openBudget] : null)

    if (!budget2) {
        return (
            <Dialog open={true}>
                <DialogTitle>Something has gone wrong.</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We&apos;re very sorry, but something has gone horribly wrong on our end. Please reload the page.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        )
    }

    return (<>
        <SetupDialog isOpen={setupDialogIsOpen} close={closeSetupDialog}/>
        <Dialog open={newBudgetDialogIsOpen}>
            <DialogTitle>New month, new budget!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We&apos;ve copied your previous plan to the new month. Make sure to review it, ensure everything has been
                    copied correctly, and if your planned income or expenses are different from the previous month,
                    make sure to update those as well.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNewBudgetDialog} color={'success'}>OK</Button>
            </DialogActions>
        </Dialog>
        {children?.(budget2)}
    </>);
}