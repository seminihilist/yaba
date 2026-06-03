import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import {MouseEventHandler, useId} from "react";
import {useAppDispatch} from "@/lib/hooks";
import {addBudget, addItem, addSection} from "@/store/app";
import {setHasCompletedSetup, setOpenBudget} from "@/store/user";

export default function SetupDialog({isOpen, close}: Readonly<{ isOpen: boolean; close: () => unknown; }>) {
    const dispatch = useAppDispatch();

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>Welcome to YABA!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We've created a basic budget outline for you to get started. Feel free
                    to edit it for your own purposes!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Let's Go!</Button>
            </DialogActions>
        </Dialog>
    );
}