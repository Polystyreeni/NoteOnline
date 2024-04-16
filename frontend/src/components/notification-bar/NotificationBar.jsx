import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NOTIFICATION_TYPE } from "../../store/actionTypes";
import { Alert, Box, Snackbar } from "@mui/material";

const NotificationBar = () => {

    const notificationStatus = useSelector((state) => state.notification);
    const [currentTimer, setCurrentTimer] = useState("");
    const [activeNotification, setActiveNotification] = useState(null);

    const messageDuration = 4000;

    useEffect(() => {
        addNotification(notificationStatus);
    }, [notificationStatus]);

    function addNotification(status) {
        const id = Date.now();
        const newNotification = {
            id: id,
            type: status.type,
            message: status.message,
        };

        clearTimeout(currentTimer);
        setActiveNotification(newNotification);

        setCurrentTimer(setTimeout(() => {
            setActiveNotification(null);
        }, messageDuration));
    }

    function getNotificationSeverity() {
        if (activeNotification === null)
            return "info"
        switch (activeNotification.type) {
            case NOTIFICATION_TYPE.none:
                return "info";
            case NOTIFICATION_TYPE.success:
                return "success";
            case NOTIFICATION_TYPE.error:
                return "error";
            default:
                return "info";
        }
    }

    return (
        <Box>
            {activeNotification !== null && (
                <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={activeNotification.type !== NOTIFICATION_TYPE.none}
                autoHideDuration={messageDuration}>
                    <Alert
                    severity={getNotificationSeverity()}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {activeNotification === null ? "" : activeNotification.message}
                </Alert>       
            </Snackbar> 
            )}
             
        </Box>
    );
};

export default NotificationBar;