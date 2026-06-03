import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React, {useId, SubmitEvent} from "react";
import {useAppDispatch} from "@/lib/hooks";

export default function NewTransactionDialog({isOpen, itemID, close}: Readonly<{
    isOpen: boolean,
    itemID: number | null,
    close: () => unknown
}>) {
    const dispatch = useAppDispatch();

    const formId = useId();

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const amount = Number(formJson.amount);

        dispatch({
            type: "app/addTransaction",
            payload: {
                itemID: itemID,
                amount: amount,
                timestamp: Date.now(),
            }
        });

        // Close the dialog
        close();
    }

    return (
        <Dialog
            open={isOpen}
            onClose={() => close()}>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the amount of the transaction.
                </DialogContentText>
                <form onSubmit={onSubmit} id={formId}>
                    <TextField
                        required
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => close()}>Cancel</Button>
                <Button type="submit" form={formId}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}