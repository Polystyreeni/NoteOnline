import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROLE_TYPE, NOTIFICATION_TYPE } from "../../store/actionTypes";
import { Navigate } from "react-router-dom";
import { loginThunk } from "../../store/actionCreators/thunks/Auth";
import { isValidEmail } from "../../utility/loginHelper";
import { setNotification } from "../../store/actionCreators/notificationActions";

const Login = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    function onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        if (!isValidEmail(userData.email)) {
            const message = {
                type: NOTIFICATION_TYPE.error,
                message: "Invalid credentials given!"
            }
            dispatch(setNotification(message));
            
            console.log("Invalid credentials given!");
            return;
        }

        dispatch(loginThunk(userData));
    }

    return (
        <div>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/notes"}/>
            )}
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <label>
                    Email:
                    <input name="email" type="email" placeholder="user@email.com" required/>
                </label>
                <label>
                    Password:
                    <input name="password" type="password" placeholder="password" required/>
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;