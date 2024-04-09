import { NEW_ACTIVE_NOTE, REMOVE_ACTIVE_NOTE, SET_ACTIVE_NOTE } from "../actionTypes";
import { defaultNewNote } from "../reducers/activeNoteReducer";

export const setActiveNote = (note) => ({
    type: SET_ACTIVE_NOTE,
    payload: note
});

export const clearActiveNote = () => ({
    type: REMOVE_ACTIVE_NOTE
});

export const newActiveNote = () => ({
    type: NEW_ACTIVE_NOTE,
    payload: defaultNewNote
});