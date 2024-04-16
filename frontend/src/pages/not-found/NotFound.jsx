import { Typography } from "@mui/material";
import styles from "./NotFound.module.css"
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className={styles.contentContainer}>
            <Typography variant="h4">404 Not found</Typography>
            <span className={styles.welcomeText}>Go 
                <Link className={styles.link} to={"/"}>Home</Link>
                , you're drunk. 
            </span>
        </div>
        
    );
};

export default NotFound;