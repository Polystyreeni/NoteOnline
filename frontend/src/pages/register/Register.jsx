import { useDispatch, useSelector } from "react-redux";
import { isValidEmail, isValidPassword } from "../../utility/loginHelper";
import { registerThunk } from "../../store/actionCreators/thunks/Auth";
import { AUTH_ROLE_TYPE, NOTIFICATION_TYPE } from "../../store/actionTypes";
import { Navigate } from "react-router-dom";
import { setNotification } from "../../store/actionCreators/notificationActions";

const Register = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    function onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
            passwordRepeat: e.target.passwordRepeat.value,
        };

        if (!isValidEmail(userData.email) || !isValidPassword(userData.password) || userData.password !== userData.passwordRepeat) {
            const message = {
                type: NOTIFICATION_TYPE.error,
                message: "Invalid credentials given!"
            }
            dispatch(setNotification(message));
            return;
        }

        dispatch(registerThunk(userData));
    }

    return (
        <div>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/notes"}/>
            )}
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <label>
                    Email:
                    <input name="email" type="email" placeholder="user@email.com" required/>
                </label>
                <label>
                    Password:
                    <input name="password" type="password" placeholder="password" required/>
                </label>
                <label>
                    Repeat password:
                    <input name="passwordRepeat" type="password" placeholder="password" required/>
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;