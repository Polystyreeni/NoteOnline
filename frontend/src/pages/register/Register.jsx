import { useDispatch, useSelector } from "react-redux";
import { checkPasswordStrength, isValidEmail, isValidPassword, passwordRules } from "../../utility/loginHelper";
import { registerThunk } from "../../store/actionCreators/thunks/Auth";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Register.module.css"
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Check, Dangerous, Info, SentimentNeutralRounded, Warning } from "@mui/icons-material";

const Register = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [passRepeatError, setPassRepeatError] = useState(false);
    const [passErrorMessage, setPassErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Password score checking
    const [passScore, setPassScore] = useState(null);
    const [passWarning, setPassWarning] = useState(null);
    const [passTips, setPassTips] = useState([]);

    const navigate = useNavigate();
    const passRules = passwordRules;

    function onChangeEmail() {
        setEmailError(false);
    }

    function onChangePass() {
        setPassError(false);
    }

    function onChangeRepeat() {
        setPassRepeatError(false);
    }

    async function onSubmit(e) {
        e.preventDefault();

        // Disable submit button
        setSubmitting(true);

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
            passwordRepeat: e.target.passwordRepeat.value,
        };

        if (!isValidEmail(userData.email)) {
            setEmailError(true);
            setSubmitting(false);
            return;
        }

        const passScoreValid = passScore === null ? checkPassScore(userData.password) : passScore > 2; 
        const passStatus = isValidPassword(userData.password);
        if (!passStatus.success || !passScoreValid) {
            setPassError(true);
            setPassErrorMessage(passStatus.message);
            setSubmitting(false);
            return;
        }

        if (userData.password !== userData.passwordRepeat) {
            setPassRepeatError(true);
            setSubmitting(false);
            return;
        }

        // Redirect to login page if successful login
        const registerSuccess = await dispatch(registerThunk(userData));
        if (registerSuccess) {
            navigate("/login");
        }

        setSubmitting(false);
    }

    function onPasswordBlur(e) {
        const pass = e.target.value;
        const passStatus = isValidPassword(pass);
        setPassError(!passStatus.success);
        setPassErrorMessage(passStatus.message);
        checkPassScore(pass);
    }

    /**
     * Check password score. 
     * @param {string} pass password in plaintext
     * @returns True if password is strong, false otherwise
     */
    function checkPassScore(pass) {
        if (pass === undefined || pass.length < 1)
        {
            setPassScore(null);
            setPassWarning(null);
            setPassTips([]);
            return false;
        }

        const passResults = checkPasswordStrength(pass);
        const feedback = passResults.feedback;
        const score = passResults.score;

        setPassScore(score);
        setPassWarning(feedback.warning);
        setPassTips(feedback.suggestions);

        return score > 2;
    }

    /**
     * Return an appropriate label for password strength
     * @param {number} score password score described by zxcvbn
     * @returns Score label
     */
    function getPasswordLabel(score) {
        switch (score) {
            case 0:
            case 1:
                return (<Dangerous />)
            case 2:
                return (<Warning />)
            case 3:
                return (<SentimentNeutralRounded />)
            case 4:
                return (<Check />)
            default:
                return (<Check />)
        }
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
                        onBlur={onPasswordBlur}
                        helperText={passErrorMessage}/>
                </div>
                {passScore !== null && (
                    <Stack alignItems="center" justifyContent="center" direction="row" gap={1}>
                        <span>{getPasswordLabel(passScore)}</span>
                        <Typography variant="body1">{`Password strength: ${passScore} / 4`}</Typography>
                    </Stack>
                )}
                {passWarning !== null && (
                    <Typography variant="body2">{passWarning}</Typography>
                )}
                {passTips.map((warning, index) => (
                    <Typography key={index} variant="body2">{warning}</Typography>
                ))}
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
                <Button variant="contained" type="submit" disabled={submitting}>Register</Button>
                <Stack alignItems="center" justifyContent="center" direction="row" gap={1} marginTop={"16px"}>
                    <Info />
                    <Typography variant="body1">Password must contain: </Typography>
                </Stack>
                {passRules.map((rule, index) => (
                    <Typography key={index} variant="body2">{`\u2022 ${rule}`}</Typography>
                ))}
            </Box>
        </div>
    );
};

export default Register;