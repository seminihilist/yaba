import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export default function SetupDialog({isOpen, close}: Readonly<{ isOpen: boolean; close: () => unknown; }>) {
    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>Welcome to YABA!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We've created a basic budget outline with some default numbers to get you started. Make sure to
                    change it to fit your own situation!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Let's Go!</Button>
            </DialogActions>
        </Dialog>
    );
}