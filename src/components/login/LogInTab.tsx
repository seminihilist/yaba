import {Alert, Button, Divider, Tab, Tabs, TextField} from "@mui/material";
import {Error, Login} from "@mui/icons-material";
import {logIn} from "@/server/logIn";
import {redirect} from "next/navigation";
import {SubmitEventHandler, useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {createUser} from "@/server/createUser";

export default function LogInTab() {
    const [openTab, setOpenTab] = useState<'log_in' | 'create_account'>('log_in');
    const [pleaseEnterYourUsernameAlertIsOpen, setPleaseEnterYourUsernameAlertIsOpen] = useState(false);
    const [pleaseEnterYourPasswordAlertIsOpen, setPleaseEnterYourPasswordAlertIsOpen] = useState(false);
    const [pleaseReEnterYourPasswordAlertIsOpen, setPleaseReEnterYourPasswordAlertIsOpen] = useState(false);
    const [passwordsDoNotMatchAlertIsOpen, setPasswordsDoNotMatchAlertIsOpen] = useState(false);
    const [incorrectUsernameOrPasswordAlertIsOpen, setIncorrectUsernameOrPasswordIsOpen] = useState(false);
    const [usernameAlreadyInUseAlertIsOpen, setUsernameAlreadyInUseAlertIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitLogIn: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = (formData.get("username")! as string).trim();
        if (username === "") {
            setPleaseEnterYourUsernameAlertIsOpen(true);
            return;
        } else {
            setPleaseEnterYourUsernameAlertIsOpen(false);
        }

        const password = (formData.get("password")! as string);
        if (password === "") {
            setPleaseEnterYourPasswordAlertIsOpen(true);
            return;
        } else {
            setPleaseEnterYourPasswordAlertIsOpen(false);
        }

        setIsLoading(true);
        logIn({username, password}).then((result) => {
            if (result.ok) {
                redirect('/');
            } else {
                setIncorrectUsernameOrPasswordIsOpen(true);
            }
            setIsLoading(false);
        });
    }

    const onSubmitCreateAccount: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = (formData.get("username")! as string).trim();
        if (username === "") {
            setPleaseEnterYourUsernameAlertIsOpen(true);
            return;
        } else {
            setPleaseEnterYourUsernameAlertIsOpen(false);
        }

        const password = (formData.get("password")! as string);
        if (password === "") {
            setPleaseEnterYourPasswordAlertIsOpen(true);
            return;
        } else {
            setPleaseEnterYourPasswordAlertIsOpen(false);
        }

        const confirmPassword = (formData.get("confirmPassword")! as string);
        if (confirmPassword === "") {
            setPleaseReEnterYourPasswordAlertIsOpen(true);
            return;
        }

        setPleaseEnterYourPasswordAlertIsOpen(false);
        if (password !== confirmPassword) {
            setPasswordsDoNotMatchAlertIsOpen(true);
            return;
        }

        setIsLoading(true);
        createUser({username, password}).then((result) => {
            if (result.ok) {
                redirect('/');
            } else {
                setUsernameAlreadyInUseAlertIsOpen(true);
            }
            setIsLoading(false);
        });
    };

    return (<>
            <Tabs variant="fullWidth" value={openTab} onChange={(_, newTab) => setOpenTab(newTab)}>
                <Tab value={'log_in'} icon={<Login/>} iconPosition={'start'} label="Log In"/>
                <Tab value={'create_account'} icon={<Login/>} iconPosition={'start'} label="Create an Account"/>
            </Tabs>
            <Divider/>
            {null /* TODO: single sign on options */}
            {pleaseEnterYourUsernameAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                Please enter your username.
            </Alert>}
            {pleaseEnterYourPasswordAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                Please enter your password.
            </Alert>}
            {pleaseReEnterYourPasswordAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                Please confirm your password by entering it again.
            </Alert>}
            {passwordsDoNotMatchAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                Passwords do not match.
            </Alert>}
            {incorrectUsernameOrPasswordAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                Incorrect username or password.
            </Alert>}
            {usernameAlreadyInUseAlertIsOpen && <Alert
                severity={'error'}
                icon={<Error fontSize={'inherit'}/>}
            >
                That username is already in use.
            </Alert>}
            <form onSubmit={openTab === 'log_in' ? onSubmitLogIn : onSubmitCreateAccount}>
                <TextField label={"Username"} fullWidth={true} margin={'dense'} name={'username'}/>
                <TextField type={'password'} label={"Password"} fullWidth={true} margin={'dense'} name={'password'}/>
                {openTab === 'create_account' &&
                    <TextField type={'password'} label={"Confirm Password"} fullWidth={true} margin={'dense'}
                               name={'confirmPassword'}/>}
                <Button type={'submit'}>{
                    isLoading ? <CircularProgress/> : "Submit"
                }</Button>
            </form>
        </>
    )
}