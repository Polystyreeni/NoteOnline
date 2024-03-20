import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NOTIFICATION_TYPE } from "../../store/actionTypes";

const NotificationBar = () => {

    const notificationStatus = useSelector((state) => state.notification);
    const [currentTimer, setCurrentTimer] = useState("");
    const [activeNotification, setActiveNotification] = useState(null);

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
        }, 3000));
    }

    // TODO: Assign a color based on the type of notification
    return (
        <div>
            {(activeNotification !== null && activeNotification.type !== NOTIFICATION_TYPE.none) && (
                <div>{activeNotification.message}</div>
            )}
        </div>
    );
};

export default NotificationBar;