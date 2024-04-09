import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultNewNote } from "../../store/reducers/activeNoteReducer";
import { addNoteThunk, updateNoteThunk } from "../../store/actionCreators/thunks/Note";
import { Navigate, useNavigate } from "react-router-dom";
import { setNotification } from "../../store/actionCreators/notificationActions";
import { generateMessage } from "../../utility/notificationUtils";
import { APP_STATE_TYPE, AUTH_ROLE_TYPE, NOTIFICATION_TYPE } from "../../store/actionTypes";
import styles from "./NoteView.module.css"

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
        exitView();
    }

    function saveNote(noteHeader, noteContent) {
        
        if (noteHeader.length < 1 || noteContent.length < 1) {
            dispatch(setNotification(generateMessage(NOTIFICATION_TYPE.error), "Note header/content must not be empty!"));
            return;
        }

        // Add new note / update existing note
        const note = {
            owner: auth.id,
            header: noteHeader,
            content: noteContent
        };
        if (activeNote.id === defaultNewNote.id) {
            console.log("Add note");
            dispatch(addNoteThunk(note));
        } else {
            console.log("Update note");
            dispatch(updateNoteThunk(activeNote.id, note));
        }
    }

    function exitView() {
        navigate("/notes");
    }
    
    return (
        <div className={styles.root}>
            {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
                <Navigate to={"/"}/>
            )}
            {loading && (
                <div>Loading...</div>
            )}
            {(!loading && Object.keys(activeNote).length > 0) && (
                <form onSubmit={onSubmit}>
                    <div>
                        <div>Name</div>
                        <input 
                            className={styles.nameInput}
                            type="text" 
                            name="noteHeader" 
                            placeholder="Note header..." 
                            defaultValue={activeNote.header}
                            onChange={onChangeHeader}/>
                    </div>
                    <div>
                        <div>{modified ? "*Note content" : "Note content"}</div>
                        <textarea 
                            name="noteContent" 
                            rows={10} 
                            cols={60} 
                            defaultValue={activeNote.content}
                            onChange={onChangeContent}/>
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onExit}>Exit</button>
                </form>
            )}
        </div>      
    );
};

export default NoteView;