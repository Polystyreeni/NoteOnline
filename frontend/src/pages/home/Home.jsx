import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import styles from "./Home.module.css"
import { Typography } from "@mui/material";

const Home = () => {
    const auth = useSelector((state) => state.auth);

    return (
        <div className={styles.contentContainer}>
            {!auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                /* Don't allow this route for logged in users */
                <Navigate to={"/notes"}/>
            )}
            <Typography variant="h2">Home</Typography>
            <span className={styles.welcomeText}>Welcome! Please 
                <Link className={styles.link} to={"/login"}>Login</Link>
                or 
                <Link className={styles.link} to={"/register"}>Register</Link>
            </span>
        </div>
    );
};

export default Home;