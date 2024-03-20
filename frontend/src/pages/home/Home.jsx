import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";

const Home = () => {
    const auth = useSelector((state) => state.auth);

    return (
        <div>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/notes"}/>
            )}
            <h1>Home</h1>
            <span>Welcome! Please 
                <Link to={"/login"}>Login</Link>
                or 
                <Link to={"/register"}>Register</Link>
            </span>
        </div>
    );
};

export default Home;