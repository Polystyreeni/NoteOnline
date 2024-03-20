import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import notificationReducer from "./reducers/notificationReducer";
import noteReducer from "./reducers/noteReducer";

export const reducers = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    notes: noteReducer
});

export default legacy_createStore(
    reducers,
    applyMiddleware(thunk),
);