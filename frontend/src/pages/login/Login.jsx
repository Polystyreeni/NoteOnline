import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate } from "react-router-dom";
import { loginThunk } from "../../store/actionCreators/thunks/Auth";
import { isValidEmail } from "../../utility/loginHelper";
import styles from "./Login.module.css"
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Login = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);

    function onNameChange(e) {
        setEmailError(false);
    }

    function onPassChange(e) {
        setPassError(false);
    }

    function onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        if (!isValidEmail(userData.email)) {
            setEmailError(true);
            return;
        }

        dispatch(loginThunk(userData));
    }

    return (
        <div className={styles.contentContainer}>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/notes"}/>
            )}
            <Typography variant="h2">Login</Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={onSubmit}
                >
                <div className={styles.inputRow}>
                    <TextField 
                        label="Email"
                        name="email"
                        type="email"
                        required
                        error={emailError}
                        onChange={onNameChange}
                        helperText={emailError ? "Please insert a valid email address" : ""}
                    />
                </div>
                <div className={styles.inputRow}>
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        required
                        error={passError}
                        onChange={onPassChange}
                        helperText={passError ? "TODO PASSWORD RULE" : ""}
                    />
                </div>
                <Button variant="contained" type="submit">Login</Button>
            </Box>
        </div>
    );
};

export default Login;