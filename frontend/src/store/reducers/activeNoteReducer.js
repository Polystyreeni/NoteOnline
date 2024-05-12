import { NEW_ACTIVE_NOTE, REMOVE_ACTIVE_NOTE, SET_ACTIVE_NOTE } from "../actionTypes"

const defaultState = {};

// Default values are used to determine if 
// request should be create or update 
export const defaultNewNote = {
    id: -1,
    owner: -1,
    header: "",
    content: "",
};

const activeNoteReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ACTIVE_NOTE:
        case NEW_ACTIVE_NOTE:
            return action.payload;
        case REMOVE_ACTIVE_NOTE:
            return defaultState;
        default:
            return state;
    }
};

export default activeNoteReducer;