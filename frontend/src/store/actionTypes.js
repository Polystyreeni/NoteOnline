
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

// Notification actions
export const SET_NOTIFICATION = "SET_NOTIFICATION";

// Notification types
export const NOTIFICATION_TYPE = {
    none: "NOTIFICATION_NONE",
    success: "NOTIFICATION_SUCCESS",
    error: "NOTIFICATION_ERROR",
};