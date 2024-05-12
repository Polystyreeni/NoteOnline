import axios from "axios";
import { setActiveNote } from "../activeNoteActions";
import { setAppState } from "../appStateActions";
import { APP_STATE_TYPE, NOTIFICATION_TYPE } from "../../actionTypes";
import { generateMessage } from "../../../utility/notificationUtils";
import { setNotification } from "../notificationActions";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

/**
 * Sends a GET request to the server, fetching note data with the given id. Updates app state accordingly.
 * @param {number} id ID of the note
 * @returns None - updates app state via Redux
 */
export const setActiveNoteThunk = (id) => {
    return async function(dispatch) {
        try {
            dispatch(setAppState(APP_STATE_TYPE.loading));
            const response = await axios.get(`${BASE_URL}/notes/${id}`, {withCredentials: true});
            dispatch(setActiveNote(response.data));
            dispatch(setAppState(APP_STATE_TYPE.active));
        } catch (e) {
            dispatch(setAppState(APP_STATE_TYPE.active));
            const notification = generateMessage(NOTIFICATION_TYPE.error, `Failed to fetch note data!`);
            dispatch(setNotification(notification));
        }
    }
};
