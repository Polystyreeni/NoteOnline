import { ADD_NOTE, CLEAR_NOTES, DELETE_NOTE, SET_NOTES, UPDATE_NOTE } from "../actionTypes";

const defaultState = [];

/* Note schema
id: Int
owner: Int
createdAt: Int
modifiedAt: Int
header: String
content: String
*/

const noteReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_NOTES:
            return action.payload.sort((a, b) => b.modifiedAt - a.modifiedAt);
        case ADD_NOTE: {
            const newState = [action.payload, ...state];
            return newState.sort((a, b) => b.modifiedAt - a.modifiedAt);
        }

        case UPDATE_NOTE: {
            const newState = [...state];
            const index = newState.findIndex(note => note.id === action.payload.id);
            if (index >= 0) {
                newState[index] = action.payload;
                // TODO: Possible sort type allowed by the user
                return newState.sort((a, b) => b.modifiedAt - a.modifiedAt);
            } else {
                return state;
            }
        }

        case DELETE_NOTE: {
            return state.filter(note => note.id !== action.payload);
        }

        case CLEAR_NOTES:
            return defaultState;

        default:
            return state;
    }
};

export default noteReducer;