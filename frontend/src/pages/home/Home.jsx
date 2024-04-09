import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import styles from "./Home.module.css"

const Home = () => {
    const auth = useSelector((state) => state.auth);

    return (
        <div>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/notes"}/>
            )}
            <h1>Home</h1>
            <span className={styles.welcomeText}>Welcome! Please 
                <Link className={styles.link} to={"/login"}>Login</Link>
                or 
                <Link className={styles.link} to={"/register"}>Register</Link>
            </span>
        </div>
    );
};

export default Home;