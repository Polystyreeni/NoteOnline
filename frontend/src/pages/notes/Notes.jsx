import { useDispatch, useSelector } from "react-redux";
import { APP_STATE_TYPE, AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate, useNavigate } from "react-router-dom";
import NoteItem from "../../components/note-item/NoteItem";
import { useEffect, useState } from "react";
import { deleteNoteThunk, setNotesThunk } from "../../store/actionCreators/thunks/Note";
import { newActiveNote } from "../../store/actionCreators/activeNoteActions";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import styles from "./Notes.module.css"

const NOTE_MAX_LIMIT = process.env.REACT_APP_NOTE_LIMIT_PER_USER;

const Notes = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);
    const notes = useSelector((state) => state.notes);
    const appState = useSelector((state) => state.appState);

    const [deleting, setDeleting] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    useEffect(() => {
        if (notes === undefined || notes.length < 1)
            dispatch(setNotesThunk());
    }, []);

    function onAddNew(e) {
        dispatch(newActiveNote());
        navigate("/notes/new");
    }

    function onRequestDelete(id) {
        setDeleting(true);
        setNoteToDelete(id);
    }

    function deleteNote() {
        if (noteToDelete === null)
            return;

        dispatch(deleteNoteThunk(noteToDelete, auth.sessionToken));
        setDeleting(false);
        setNoteToDelete(null);
    }

    function onDialogClose() {
        setDeleting(false);
        setNoteToDelete(null);
    }

    return (
        <div className={styles.contentContainer}>
            {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/"}/>
            )}
            <Typography variant="h2" sx={{marginBottom: '4px'}}>My notes</Typography>
            {appState === APP_STATE_TYPE.loading && (
                <div className={styles.loadContainer}>
                    <CircularProgress/>
                </div>
            )}
            {appState === APP_STATE_TYPE.active && (
                <Box>
                    <Dialog
                        open={deleting}
                        onClose={onDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">Delete note?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this note?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onDialogClose}>No</Button>
                            <Button onClick={deleteNote} autoFocus>Yes</Button>
                        </DialogActions>
                        
                    </Dialog>
                    <Typography variant="body1">{`${notes.length} / ${NOTE_MAX_LIMIT} notes`}</Typography>
                    <Button 
                        className="addButton" 
                        variant="contained" 
                        type="button" 
                        disabled={notes.length >= NOTE_MAX_LIMIT}
                        onClick={onAddNew}>
                        Add new</Button>
                    {notes.length < 1 && (
                        <Typography variant="body1" sx={{marginTop: '10px'}}>No notes yet. Create one by clicking above!</Typography>
                    )}
                    {notes.map((note) => (
                        <NoteItem
                            key={note.id}
                            id={note.id}
                            header={note.header}
                            modifiedAt={note.modifiedAt}
                            createdAt={note.createdAt}
                            owner={note.owner}
                            onDelete={onRequestDelete}
                        />
                    ))}
                </Box>
            )} 
        </div>
    );
};

export default Notes;