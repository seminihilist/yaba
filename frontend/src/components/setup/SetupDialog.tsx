import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {useAppDispatch} from "@/lib/hooks";

export default function SetupDialog({isOpen, close}: Readonly<{ isOpen: boolean; close: () => unknown; }>) {
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