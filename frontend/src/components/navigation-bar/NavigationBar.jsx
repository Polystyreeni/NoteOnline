import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { logoutThunk } from "../../store/actionCreators/thunks/Auth";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    function onLogout() {
        dispatch(logoutThunk());
    }

    function onLogin() {
        navigate("/login");
    }

    function onRegister() {
        navigate("/register");
    }

    return (
        <Box 
            sx={{
                bgcolor: '#1d2b53',
                borderRadius: '1px',
                padding: '4px'
            }}
        >
            <Typography variant="h2" color="#fff" sx={{paddingLeft: '6px'}}>NoteOnline</Typography>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Button onClick={onLogout}>Logout</Button>
            )}
            {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Box>
                    <Button onClick={onLogin}>Login</Button>
                    <Button onClick={onRegister}>Register</Button>
                </Box>
            )}
        </Box>
    );
};

export default NavigationBar;