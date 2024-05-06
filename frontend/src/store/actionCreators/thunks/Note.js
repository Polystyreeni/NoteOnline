import axios from "axios";
import { APP_STATE_TYPE, NOTIFICATION_TYPE } from "../../actionTypes";
import { setNotification } from "../notificationActions";
import { addNote, deleteNote, setNotes, updateNote } from "../noteActions";
import { generateMessage } from "../../../utility/notificationUtils";
import { setAppState } from "../appStateActions";
import { setActiveNote } from "../activeNoteActions";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

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

        } catch (e) {
            const message = e.response.data !== undefined ? e.response.data : e.message;
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed adding note: ${message}`)));
            setAppState(APP_STATE_TYPE.active);
        }
    }
};

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
        } catch (e) {
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed updating note: ${e.message}`)));
            setAppState(APP_STATE_TYPE.active);
        }
    }
};

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
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed deleting note: ${e.message}`)));
        }
    }
};
