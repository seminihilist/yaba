import {Button} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {addSection} from "@/store/app";

export default function AddSectionButton({openSectionInOverview}: Readonly<{
    openSectionInOverview: (id: number) => unknown;
}>) {
    const openBudgetId = useAppSelector(state => state.user.openBudget);
    if (openBudgetId == null) return;

    const dispatch = useAppDispatch();

    const onClick = () => {
        const {payload: {newId: newSectionId}} = dispatch(addSection({
            budgetID: openBudgetId,
            name: "New Section",
        }));

        openSectionInOverview(newSectionId as number);
    }

    return (
        <Button startIcon={<Add/>} onClick={onClick}>Add Section</Button>
    )
}