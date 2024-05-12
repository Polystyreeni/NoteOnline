import axios from "axios";
import { APP_STATE_TYPE, NOTIFICATION_TYPE } from "../../actionTypes";
import { setNotification } from "../notificationActions";
import { addNote, deleteNote, setNotes, updateNote } from "../noteActions";
import { generateMessage } from "../../../utility/notificationUtils";
import { setAppState } from "../appStateActions";
import { setActiveNote } from "../activeNoteActions";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

/**
 * Gets all note details from the server. Updates app state accordingly.
 * @returns None - state is updated via Redux
 */
export const setNotesThunk = () => {
    return async function(dispatch) {
        setAppState(APP_STATE_TYPE.loading);
        try {
            const response = await axios.get(`${BASE_URL}/notes`, {withCredentials: true});
            dispatch(setNotes(response.data));
            setAppState(APP_STATE_TYPE.active);
            
        } catch (e) {
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed retrieving notes: ${e.message}`)));
            setAppState(APP_STATE_TYPE.active);
        }
    }
};

/**
 * Sends a POST request to the server to add given note data. 
 * @param {object} note note data 
 * @param {string} sessionToken CSRF token for request validity check
 * @returns True if add is successful, false otherwise
 */
export const addNoteThunk = (note, sessionToken) => {
    return async function(dispatch) {
        setAppState(APP_STATE_TYPE.loading);
        try {
            const response = await axios.post(`${BASE_URL}/notes`, note, {
                headers: {
                    "X-CSRF-TOKEN": sessionToken,
                    "Content-Type": "application/json"},
                withCredentials: true
            });
            
            // Add only node details to state
            const details = {
                id: response.data.id,
                ownerId: response.data.ownerId,
                createdAt: response.data.createdAt,
                modifiedAt: response.data.modifiedAt,
                header: response.data.header,
            };

            dispatch(addNote(details));

            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "New note added")));
            setAppState(APP_STATE_TYPE.active);

            // Update active note state, so user can continue editing the file
            dispatch(setActiveNote(response.data));
            return true;

        } catch (e) {
            const message = e.response.data !== undefined ? e.response.data : e.message;
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed adding note: ${message}`)));
            setAppState(APP_STATE_TYPE.active);
            return false;
        }
    }
};

/**
 * Sends a PUT request to the server to update given note data
 * @param {number} id note id to update
 * @param {Object} note updated note content
 * @param {string} sessionToken CSRF token for request validity check
 * @returns True if update is successful, false otherwise
 */
export const updateNoteThunk = (id, note, sessionToken) => {
    return async function(dispatch) {
        try {
            setAppState(APP_STATE_TYPE.loading);
            const response = await axios.put(`${BASE_URL}/notes/${id}`, note, {
                headers: {
                    "X-CSRF-TOKEN": sessionToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            
            // Only update details to the whole notes state
            const details = {
                id: response.data.id,
                ownerId: response.data.ownerId,
                createdAt: response.data.createdAt,
                modifiedAt: response.data.modifiedAt,
                header: response.data.header
            };
            dispatch(updateNote(details));

            // Update entirety of active note state
            dispatch(setActiveNote(response.data));
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "Updated note")));
            setAppState(APP_STATE_TYPE.active);
            return true;
        } catch (e) {
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed updating note: ${e.message}`)));
            setAppState(APP_STATE_TYPE.active);
            return false;
        }
    }
};

/**
 * Sends a DELETE request to the server to delete note with given id
 * @param {*} id id of note to delete
 * @param {*} sessionToken CSRF token for request validity check
 * @returns 
 */
export const deleteNoteThunk = (id, sessionToken) => {
    return async function(dispatch) {
        try {
            await axios.delete(`${BASE_URL}/notes/${id}`, {
                headers: {
                    "X-CSRF-TOKEN": sessionToken,
                    "Content-Type": "application/json"},
                withCredentials: true
            });
            dispatch(deleteNote(id));
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "Note deleted")));
        } catch (e) {
            const message = e.response.data !== undefined ? e.response.data : e.message;
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed deleting note: ${message}`)));
        }
    }
};
