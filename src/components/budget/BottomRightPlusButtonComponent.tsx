import {Add} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {MouseEventHandler} from "react";

export default function BottomRightPlusButtonComponent({onClick}: Readonly<{ onClick: MouseEventHandler }>) {
    return (
        <>
            <IconButton className="absolute bottom-3 right-3 w-15 h-15 bg-pink-300"
                        onClick={onClick}><Add/></IconButton>
        </>)
}