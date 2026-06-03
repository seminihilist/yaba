import {Box, LinearProgress, linearProgressClasses, styled, Typography} from "@mui/material";
import {GREEN} from "@/app/theme";
import React from "react";
import {PieChart} from "@mui/x-charts";

const BolderLinearProgress = styled(LinearProgress)(({theme}) => ({
    height: 10,
    borderRadius: 5,
    transition: 'left 0.8s',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: GREEN,
        ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8',
        }),
    },
}));

export default function AmountSpentProgressBar({
                                                   // incomePlanned,
                                                   // incomeReceived,
                                                   // expensesPlanned,
                                                   // expensesSpent,
                                                   amountPlanned,
                                                   amountSpent,
                                               }: Readonly<{
    // incomePlanned: number;
    // incomeReceived: number;
    // expensesPlanned: number;
    // expensesSpent: number;
    amountPlanned: number,
    amountSpent: number,
}>) {
    //
    // const data = (expensesPlanned > incomePlanned) ?
    //     // Then we're planning to spend more than we receive - oh dear
    //     [
    //         {id: 0, value: incomePlanned, label: "Planned Income", color: 'gray'},
    //         {
    //             id: 1,
    //             value: expensesPlanned - incomePlanned,
    //             label: "Not Good" /* TODO what do I call this? */,
    //             color: 'red'
    //         },
    //     ]
    //     :
    //     [
    //         {id: 0, value: expensesPlanned, label: "Planned Expenditures", color: 'green'},
    //         {id: 1, value: amountPlanned, label: "Planned", color: 'gray'},
    //     ]
    //
    // const incomeSeries = {
    //     innerRadius: '80px',
    //     outerRadius: '90px',
    //     arcLabel: 'label',
    //     data: [
    //         {id: 0, value: incomeReceived, label: "Received", color: 'green'},
    //         {id: 1, value: incomePlanned, label: "Planned", color: 'gray'}
    //     ]
    // }
    //
    // const incomeSeries = {
    //     innerRadius: '80px',
    //     outerRadius: '90px',
    //     arcLabel: 'label',
    //     data: [
    //         {id: 0, value: incomeReceived, label: "Received", color: 'green'},
    //         {id: 1, value: incomePlanned, label: "Planned", color: 'gray'}
    //     ]
    // }
    //
    // return (
    //     <PieChart height={200} series={[
    //         {
    //             innerRadius: '90px',
    //             outerRadius: '100px',
    //             arcLabel: 'label',
    //             data: [
    //                 {id: 0, value: amountSpent, label: "Spent", color: 'green'},
    //                 {id: 1, value: amountPlanned, label: "Planned", color: 'gray'}
    //             ]
    //         }
    //     ]}/>
    // );

    const percentSpent = amountPlanned === 0 ? (amountSpent === 0 ? 100 : 0) : (amountSpent / amountPlanned) * 100;

    return (
        <Box sx={{flexDirection: "column"}}>
            <Box display={"flex"} flexDirection={"row"}>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'left'}}
                >$0</Typography>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'right'}}
                >{`$${amountPlanned}`}</Typography>
            </Box>
            <Box>
                <BolderLinearProgress
                    variant="determinate"
                    aria-label="Percent spent"
                    sx={{
                        width: '100%',
                    }}
                    value={percentSpent}
                />
            </Box>
            <Box height={'11px'} width={'100%'} display={'flex'} justifyContent={'center'}>
                <Typography
                    variant="caption"
                >
                    {`$${amountSpent}`}
                </Typography>
            </Box>
        </Box>
    )
}