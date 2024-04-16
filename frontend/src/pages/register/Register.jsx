import { useDispatch, useSelector } from "react-redux";
import { isValidEmail, isValidPassword } from "../../utility/loginHelper";
import { registerThunk } from "../../store/actionCreators/thunks/Auth";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate } from "react-router-dom";
import styles from "./Register.module.css"
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Register = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [passRepeatError, setPassRepeatError] = useState(false);

    function onChangeEmail(e) {
        setEmailError(false);
    }

    function onChangePass(e) {
        setPassError(false);
    }

    function onChangeRepeat(e) {
        setPassRepeatError(false);
    }

    function onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
            passwordRepeat: e.target.passwordRepeat.value,
        };

        if (!isValidEmail(userData.email)) {
            setEmailError(true);
            return;
        }

        if (!isValidPassword(userData.password)) {
            setPassError(true);
            return;
        }

        if (userData.password !== userData.passwordRepeat) {
            setPassRepeatError(true);
            return;
        }

        dispatch(registerThunk(userData));
    }

    return (
        <div className={styles.contentContainer}>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/"}/>
            )}
            <Typography variant="h2">Register</Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={onSubmit}>
                <div className={styles.inputRow}>
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="user@email.com"
                        required
                        onChange={onChangeEmail}
                        error={emailError}
                        helperText={emailError ? "Please insert a valid email address" : ""}
                    />
                </div>
                <div className={styles.inputRow}>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={onChangePass}
                        error={passError}
                        helperText={passError ? "TODO PASSWORD RULE" : ""}/>
                </div>
                <div className={styles.inputRow}>
                    <TextField
                            label="Repeat Password"
                            type="password"
                            name="passwordRepeat"
                            placeholder="Password"
                            required
                            onChange={onChangeRepeat}
                            error={passRepeatError}
                            helperText={passRepeatError ? "Passwords do not match!" : ""}/>
                </div>
                <Button variant="contained" type="submit">Register</Button>
            </Box>
        </div>
    );
};

export default Register;