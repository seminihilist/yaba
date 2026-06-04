"use client";

import BudgetSectionComponent from "./BudgetSectionComponent";
import {useAppSelector} from "@/lib/hooks";
import {
    Table, TableHead, TableCell, TableRow, TableBody, Card, Container
} from "@mui/material";
import React from "react";
import {Budget} from "@/domain/types";
import AddSectionButton from "@/components/budget/AddSectionButton";

export default function BudgetWindow({
                                         budget,
                                         sectionIsOpenInOverview,
                                         openSectionInOverview,
                                         itemIsOpenInOverview,
                                         openItemInOverview,
                                     }: Readonly<{
    budget: Budget;
    sectionIsOpenInOverview: (id: number) => boolean;
    openSectionInOverview: (id: number) => unknown;
    itemIsOpenInOverview: (id: number) => boolean;
    openItemInOverview: (id: number) => unknown;
}>) {
    const allSections = useAppSelector(state => state.app.sections);

    const mySections = budget.sections.map(section => allSections[section])
        .filter(section => !!section); // todo: errors if an undefined section is present

    return (
        <>
            <Container sx={{padding: 2}}>
                <Card>
                    <Table sx={{display: 'table'}} size={'small'}>
                        <TableHead sx={{display: 'table-header-group'}}>
                            <TableRow sx={{display: 'table-row'}} className={`p-1.5`}>
                                <TableCell sx={{width: 8}}/>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-auto"></TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-25">Planned</TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-25">Remaining</TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-16">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{display: 'table-row-group'}}>
                            {[...mySections.map((section) => (
                                <BudgetSectionComponent section={section} key={section.id}
                                                        isOpenInOverview={sectionIsOpenInOverview(section.id)}
                                                        openInOverview={() => openSectionInOverview(section.id)}
                                                        itemIsOpenInOverview={itemIsOpenInOverview}
                                                        openItemInOverview={openItemInOverview}/>))]}
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <AddSectionButton openSectionInOverview={openSectionInOverview}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </Container>
        </>
    )
}
