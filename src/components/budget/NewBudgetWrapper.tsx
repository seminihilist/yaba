'use client';

import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Budget} from "@/domain/types";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import {addBudget, addSection, migrateBudget} from "@/store/app";
import {setHasCompletedSetup, setOpenBudget} from "@/store/user";
import SetupDialog from "@/components/setup/SetupDialog";
import {useQuery} from "@tanstack/react-query";
import {getCurrentlyActiveBudget} from "@/server/getCurrentlyActiveBudget";
import {getBudget} from "@/server/getBudget";
import {Error} from "@mui/icons-material";
import {budgets} from "@/db/schema";

export default function NewBudgetWrapper({children}: Readonly<{
    children: (budget: Budget) => ReactNode
}>) {
    // const dispatch = useAppDispatch();
    //
    // const budgets = Object.values(useAppSelector(state => state.app.budgets)).filter(budget => !!budget);
    //
    // const openBudget =
    //     useAppSelector(state => state.user.openBudget ? state.app.budgets[state.user.openBudget] : undefined);
    //
    // const [newBudgetDialogIsOpen, setNewBudgetDialogIsOpen] = useState(false);
    // const openNewBudgetDialog = () => setNewBudgetDialogIsOpen(true);
    // const closeNewBudgetDialog = () => setNewBudgetDialogIsOpen(false);
    //
    // const hasCheckedForNewMonth = useRef(false);
    //
    // const hasCompletedSetup = useAppSelector(state => state.user.hasCompletedSetup);
    // const [setupDialogIsOpen, setSetupDialogIsOpen] = useState(false);
    // const closeSetupDialog = () => setSetupDialogIsOpen(false);

    // useEffect(() => {
    //     if (!hasCompletedSetup) {
    //         // TODO: extract creating this default budget into its own action in the store
    //         // TODO: offer a choice of multiple templates
    //
    //         const monthStart = new Date();
    //         monthStart.setDate(1);
    //         monthStart.setHours(0, 0, 0, 0)
    //
    //         const monthEnd = new Date(monthStart);
    //         monthEnd.setMonth(monthEnd.getMonth() + 1);
    //         monthEnd.setHours(0, 0, 0, 0)
    //
    //         const {payload: {newId: newBudgetId}} = dispatch(addBudget({
    //             startTime: monthStart.getTime(),
    //             endTime: monthEnd.getTime()
    //         }));
    //
    //         dispatch(addSection({
    //             budgetID: newBudgetId as number,
    //             name: "Revenue",
    //         }));
    //
    //         dispatch(addSection({
    //             budgetID: newBudgetId as number,
    //             name: "Fixed Costs",
    //         }));
    //
    //         dispatch(addSection({
    //             budgetID: newBudgetId as number,
    //             name: "Savings and Investments",
    //         }));
    //
    //         dispatch(addSection({
    //             budgetID: newBudgetId as number,
    //             name: "Necessities",
    //         }));
    //
    //         dispatch(addSection({
    //             budgetID: newBudgetId as number,
    //             name: "Guilt-free Spending",
    //         }));
    //
    //         dispatch(setOpenBudget({id: newBudgetId as number}));
    //
    //         dispatch(setHasCompletedSetup({hasCompletedSetup: true}));
    //
    //         setSetupDialogIsOpen(true);
    //     } else if (!openBudget) {
    //         // If the currently open budget has ceased to exist for whatever reason, change it to the most recent
    //         // budget.
    //         dispatch(setOpenBudget({
    //             id: budgets.toSorted((left, right) => right.startTime - left.startTime)[0].id,
    //         }))
    //     } else if (!hasCheckedForNewMonth.current) {
    //         const now = Date.now();
    //
    //         if (openBudget.state === 'active' && now > openBudget.endTime) {
    //             const monthStart = new Date();
    //             monthStart.setDate(1);
    //             monthStart.setHours(0, 0, 0, 0)
    //
    //             const monthEnd = new Date(monthStart);
    //             monthEnd.setMonth(monthEnd.getMonth() + 1);
    //             monthEnd.setHours(0, 0, 0, 0)
    //
    //             // We've passed the end time of the current budget
    //             const {payload: {newId}} = dispatch(migrateBudget({
    //                 id: openBudget.id,
    //                 newStartTime: monthStart.getTime(),
    //                 newEndTime: monthEnd.getTime(),
    //             }));
    //
    //             dispatch(setOpenBudget({id: newId as number}));
    //
    //             openNewBudgetDialog();
    //         }
    //
    //         hasCheckedForNewMonth.current = true;
    //     }
    // }, [hasCompletedSetup, openBudget, dispatch, budgets]);
    //
    // const budget2 = useAppSelector(state => state.user.openBudget != null ? state.app.budgets[state.user.openBudget] : null)
    //
    // if (!budget2) {
    //     return (
    //         <Dialog open={true}>
    //             <DialogTitle>Something has gone wrong.</DialogTitle>
    //             <DialogContent>
    //                 <DialogContentText>
    //                     We&apos;re very sorry, but something has gone horribly wrong on our end. Please reload the page.
    //                 </DialogContentText>
    //             </DialogContent>
    //         </Dialog>
    //     )
    // }

    const {data: budgetData, error: budgetError} = useQuery({
        queryKey: ['budget'],
        async queryFn() {
            const budgetId = await getCurrentlyActiveBudget({});
            if (!budgetId.ok || !budgetId.data) {
                return null;
            }

            return getBudget({id: budgetId.data.id});
        },
    });

    // TODO: check for internet connectivity
    // TODO: handle the case where budgetData is `null`
    return budgetError
        ? (<>
            <Error/>
            <Typography variant="h4" color="error">Something went wrong.</Typography>
            <Typography variant="body1" color="textPrimary">
                We weren&apos;t able to access your budget. Please try again
                later.
            </Typography>
        </>)
        : budgetData?.ok
            ? (<>
                {/*<SetupDialog isOpen={setupDialogIsOpen} close={closeSetupDialog}/>*/}
                {/*<Dialog open={newBudgetDialogIsOpen}>*/}
                {/*    <DialogTitle>New month, new budget!</DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <DialogContentText>*/}
                {/*            We&apos;ve copied your previous plan to the new month. Make sure to review it, ensure everything has been*/}
                {/*            copied correctly, and if your planned income or expenses are different from the previous month,*/}
                {/*            make sure to update those as well.*/}
                {/*        </DialogContentText>*/}
                {/*    </DialogContent>*/}
                {/*    <DialogActions>*/}
                {/*        <Button onClick={closeNewBudgetDialog} color={'success'}>OK</Button>*/}
                {/*    </DialogActions>*/}
                {/*</Dialog>*/}
                {children?.(budget2)}
            </>)
            : (<>
                <Error/>
                <Typography variant="h4" color="error">Something went wrong.</Typography>
                <Typography variant="body1" color="textPrimary">
                    We weren&apos;t able to access your budget. Please try again
                    later.
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Error message: {budgetData?.status === 'error' && budgetData.data.message}
                </Typography>
            </>);
}