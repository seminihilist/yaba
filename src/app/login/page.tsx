'use client';

import {
    Alert,
    Button, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider, Tab, Tabs,
    TextField,
} from "@mui/material";
import {useState} from "react";
import {Login} from "@mui/icons-material";
import LogInTab from "@/components/login/LogInTab";

export default function LoginPage() {

    return (<Container maxWidth="sm">
        <LogInTab/>
    </Container>)
}