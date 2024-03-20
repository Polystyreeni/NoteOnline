import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { logoutThunk } from "../../store/actionCreators/thunks/Auth";

const NavigationBar = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    function onLogout() {
        dispatch(logoutThunk());
    }

    return (
    <div>
        {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
            <button onClick={onLogout}>Logout</button>
        )}
    </div>
    );
};

export default NavigationBar;