import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import notificationReducer from "./reducers/notificationReducer";
import noteReducer from "./reducers/noteReducer";
import activeNoteReducer from "./reducers/activeNoteReducer";
import appStateReducer from "./reducers/appStateReducer";

export const reducers = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    notes: noteReducer,
    activeNote: activeNoteReducer,
    appState: appStateReducer,
});

export default legacy_createStore(
    reducers,
    applyMiddleware(thunk),
);