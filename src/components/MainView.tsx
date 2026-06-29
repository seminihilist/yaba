import {Budget} from "@/domain/types";
import {Box, Drawer} from "@mui/material";
import BudgetWindow from "@/components/budget/BudgetWindow";
import React from "react";
import OverviewWindow from "@/components/overview/OverviewWindow";
import {useQuery} from "@tanstack/react-query";

const DESKTOP_OVERVIEW_WIDTH = 400; // px

export default function MainView({budget}: Readonly<{ budget: Budget }>) {
    const [overviewOpenID, setOverviewOpenID] = React.useState(budget.id);
    const [overviewOpenKind, setOverviewOpenKind] = React.useState<'budget' | 'section' | 'item'>('budget');

    const query = useQuery({
        queryKey: ['budget'],
        queryFn:
    });

    return (
        <div className="flex flex-row w-full h-full">
            <Box sx={{
                width: `calc(100% - ${DESKTOP_OVERVIEW_WIDTH}px)`,
                overflowY: 'scroll',
            }}>
                <BudgetWindow budget={budget}
                              sectionIsOpenInOverview={(id) => overviewOpenKind === 'section' && overviewOpenID === id}
                              openSectionInOverview={(id) => {
                                  setOverviewOpenID(id);
                                  setOverviewOpenKind('section');
                              }}
                              itemIsOpenInOverview={(id) => overviewOpenKind === 'item' && overviewOpenID === id}
                              openItemInOverview={(id) => {
                                  setOverviewOpenID(id);
                                  setOverviewOpenKind('item');
                              }}/>
            </Box>
            <Drawer variant={'persistent'} open={true} anchor={'right'} sx={{
                '& .MuiDrawer-paper': {
                    width: `${DESKTOP_OVERVIEW_WIDTH}px`,
                    boxSizing: 'border-box',
                },
            }}>
                <OverviewWindow openID={overviewOpenID} setOpenID={setOverviewOpenID}
                                openKind={overviewOpenKind} setOpenKind={setOverviewOpenKind}
                                onClose={() => {
                                    setOverviewOpenID(budget.id);
                                    setOverviewOpenKind('budget');
                                }}/>
            </Drawer>
        </div>
    )
}