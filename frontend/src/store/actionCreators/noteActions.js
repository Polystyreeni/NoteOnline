import { ADD_NOTE, CLEAR_NOTES, DELETE_NOTE, SET_NOTES, UPDATE_NOTE } from "../actionTypes";

export const setNotes = (notes) => ({
    type: SET_NOTES,
    payload: notes,
});

export const addNote = (note) => ({
    type: ADD_NOTE,
    payload: note,
});

export const updateNote = (note) => ({
    type: UPDATE_NOTE,
    payload: note,
});

export const deleteNote = (id) => ({
    type: DELETE_NOTE,
    payload: id,
});

export const clearNotes = () => ({
    type: CLEAR_NOTES,
});