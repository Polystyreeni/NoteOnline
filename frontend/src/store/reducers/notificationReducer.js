import { NOTIFICATION_TYPE, SET_NOTIFICATION } from "../actionTypes";

const defaultNotification = {
    type: NOTIFICATION_TYPE.none,
    message: "",
};

const notificationReducer = (state = defaultNotification, action) => {
    switch (action.type) {
        case SET_NOTIFICATION:
            return action.payload;
        default:
            return state;
    }
};

export default notificationReducer;