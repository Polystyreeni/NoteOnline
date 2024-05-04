import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultNewNote } from "../../store/reducers/activeNoteReducer";
import { addNoteThunk, updateNoteThunk } from "../../store/actionCreators/thunks/Note";
import { Navigate, useNavigate } from "react-router-dom";
import { setNotification } from "../../store/actionCreators/notificationActions";
import { generateMessage } from "../../utility/notificationUtils";
import { APP_STATE_TYPE, AUTH_ROLE_TYPE, NOTIFICATION_TYPE } from "../../store/actionTypes";
import styles from "./NoteView.module.css"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const NoteView = () => {

    const activeNote = useSelector((state) => state.activeNote);
    const auth = useSelector((state) => state.auth);
    const appState = useSelector((state) => state.appState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [header, setHeader] = useState("");
    const [content, setContent] = useState("");
    const [modified, setModified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const maxHeaderLength = 64;
    const maxContentLength = 5000;

    useEffect(() => {
        setHeader(activeNote.header);
        setContent(activeNote.content);
        setModified(false);
    }, [activeNote]);

    useEffect(() => {
        console.log("Update app state");
        setLoading(appState === APP_STATE_TYPE.loading);
    }, [appState])

    function onSubmit(e) {
        e.preventDefault();

        const newHeader = e.target.noteHeader.value;
        const newContent = e.target.noteContent.value;
        saveNote(newHeader, newContent);
    }

    function onChangeHeader(e) {
        const newHeader = e.target.value;
        setHeader(newHeader);

        setModified(isModified(newHeader, content));
    }

    function onChangeContent(e) {
        const newContent = e.target.value;

        setContent(newContent);
        setModified(isModified(header, newContent));
    }

    function isModified(h, c) {
        if (h !== activeNote.header || c !== activeNote.content) {
            return true;
        }
        return false;
    }

    function onExit(e) {
        if (modified) {
            setDialogOpen(true);
        } else {
            exitView();
        }
    }

    function saveNote(noteHeader, noteContent) {
        
        if (!isValidContent(noteHeader, noteContent)) {
            console.log("Not valid content");
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error, "Invalid note header/content!")));
            return;
        }

        // Add new note / update existing note
        const note = {
            owner: auth.id,
            header: noteHeader,
            content: noteContent
        };
        if (activeNote.id === defaultNewNote.id) {
            dispatch(addNoteThunk(note, auth.sessionToken));
        } else {
            dispatch(updateNoteThunk(activeNote.id, note, auth.sessionToken));
        }
    }

    function exitView() {
        navigate("/notes");
    }

    function onDialogClose() {
        setDialogOpen(false);
    }

    function saveAndExit() {
        if (!isValidContent(header, content)) {
            setDialogOpen(false);
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error), "Invalid note header/content!"));
            return;
        }
        saveNote(header, content);
        exitView();
    }

    function isValidContent(noteHeader, noteContent) {
        if (noteHeader.length < 1 || noteContent.length < 1) {
            return false;
        }

        if (noteHeader.length > maxHeaderLength || noteContent.length > maxContentLength) {
            return false;
        }

        return true;
    }
    
    return (
        <div className={styles.root}>
            {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/"}/>
            )}
            {loading && (
                <div className={styles.loadContainer}>
                    <CircularProgress/>
                </div>
            )}
            {(!loading && Object.keys(activeNote).length > 0) && (
                <Box>
                    <Dialog 
                        onClose={onDialogClose} 
                        open={dialogOpen}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">Unsaved changes</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Note contains unsaved changes, do you want to save?
                                </DialogContentText>
                                <DialogActions>
                                    <Button onClick={exitView}>Exit without saving</Button>
                                    <Button onClick={saveAndExit} autoFocus>Save and exit</Button>
                                </DialogActions>
                            </DialogContent>

                    </Dialog>
                    <IconButton onClick={onExit} size="large">
                        <ArrowBack />
                    </IconButton>
                    <form className={styles.centered} onSubmit={onSubmit}>
                        <div>
                            <Typography variant="body1">Name</Typography>
                            <TextField 
                                type="text" 
                                name="noteHeader" 
                                placeholder="Note header..." 
                                defaultValue={activeNote.header}
                                onChange={onChangeHeader}/>
                            {header.length > maxHeaderLength && (
                                <Typography variant="body1" color="#d32f2f">Header max size reached!</Typography>
                            )}
                        </div>
                        <div>
                            <Typography variant="body1">{modified ? "*Note content" : "Note content"}</Typography>
                            <textarea 
                                className={styles.contentInput}
                                name="noteContent" 
                                rows={10} 
                                cols={60} 
                                defaultValue={activeNote.content}
                                onChange={onChangeContent}/>
                            <Typography variant="body1">{`${content.length} / ${maxContentLength}`}</Typography>
                            {content.length > maxContentLength && (
                                <Typography variant="body1" color="#d32f2f">Note max size reached!</Typography>
                            )}
                            
                        </div>
                        <Button variant="contained" type="submit">Save</Button>
                    </form>
                </Box>
            )}
        </div>      
    );
};

export default NoteView;