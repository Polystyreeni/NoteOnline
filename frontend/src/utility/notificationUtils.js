import { NOTIFICATION_TYPE } from "../store/actionTypes";

export function generateMessage(type = NOTIFICATION_TYPE.success, message) {
    return {
        type: type,
        message: message
    }
}