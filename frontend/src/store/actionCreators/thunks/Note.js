import axios from "axios";
import { NOTIFICATION_TYPE } from "../../actionTypes";
import { setNotification } from "../notificationActions";
import { addNote, deleteNote, setNotes, updateNote } from "../noteActions";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

export const setNotesThunk = () => {
    return async function(dispatch) {
        try {
            const response = await axios.get(`${BASE_URL}/notes`, {withCredentials: true});
            console.log(response);
            dispatch(setNotes(response.data));
        } catch (e) {
            console.log(e);
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed retrieving notes: ${e.message}`)));
        }
    }
};

export const addNoteThunk = (note) => {
    return async function(dispatch) {
        try {
            const response = await axios.post(`${BASE_URL}/notes`, note, {withCredentials: true});
            console.log(response);
            dispatch(addNote(response.data));
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "New note added")));
        } catch (e) {
            console.log(e);
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed adding note: ${e.message}`)));
        }
    }
}

export const updateNoteThunk = (id, note) => {
    return async function(dispatch) {
        try {
            const response = await axios.put(`${BASE_URL}/notes/${id}`, note, {withCredentials: true});
            console.log(response);
            dispatch(updateNote(note));
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "Updated note")));
        } catch (e) {
            console.log(e);
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed updating note: ${e.message}`)));
        }
    }
}

export const deleteNoteThunk = (id) => {
    return async function(dispatch) {
        try {
            const response = await axios.delete(`${BASE_URL}/notes/${id}`, {withCredentials: true});
            console.log(response);
            dispatch(deleteNote(id));
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.success, "Note deleted")));
        } catch (e) {
            console.log(e);
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, `Failed deleting note: ${e.message}`)));
        }
    }
}

function generateMessage(type = NOTIFICATION_TYPE.success, message) {
    return {
        type: type,
        message: message
    }
}