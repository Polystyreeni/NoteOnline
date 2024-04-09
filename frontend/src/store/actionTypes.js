
// User actions
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";

// User role types. These match what the backend sends
export const AUTH_ROLE_TYPE = {
    unregistered: "ROLE_NONE",
    user: "ROLE_USER",
    admin: "ROLE_ADMIN",
};

// Note actions
export const SET_NOTES = "SET_NOTES";
export const ADD_NOTE = "ADD_NOTE";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const DELETE_NOTE = "DELETE_NOTE";
export const CLEAR_NOTES = "CLEAR_NOTES";

// Notification actions
export const SET_NOTIFICATION = "SET_NOTIFICATION";

// Notification types
export const NOTIFICATION_TYPE = {
    none: "NOTIFICATION_NONE",
    success: "NOTIFICATION_SUCCESS",
    error: "NOTIFICATION_ERROR",
};

// Active note actions
export const SET_ACTIVE_NOTE = "SET_ACTIVE_NOTE";
export const REMOVE_ACTIVE_NOTE = "REMOVE_ACTIVE_NOTE";
export const NEW_ACTIVE_NOTE = "NEW_ACTIVE_NOTE";

// State action
export const SET_APP_STATE = "SET_APP_STATE";
export const APP_STATE_TYPE = {
    loading: "LOADING",
    active: "ACTIVE",
};