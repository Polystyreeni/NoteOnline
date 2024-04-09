import { useDispatch, useSelector } from "react-redux";
import { APP_STATE_TYPE, AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate, useNavigate } from "react-router-dom";
import NoteItem from "../../components/note-item/NoteItem";
import { useEffect } from "react";
import { setNotesThunk } from "../../store/actionCreators/thunks/Note";
import { newActiveNote } from "../../store/actionCreators/activeNoteActions";
import styles from "./Notes.module.css"

const Notes = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);
    const notes = useSelector((state) => state.notes);
    const appState = useSelector((state) => state.appState);

    useEffect(() => {
        if (notes === undefined || notes.length < 1)
            dispatch(setNotesThunk());
    }, []);

    function onAddNew(e) {
        dispatch(newActiveNote());
        navigate("/notes/new");
    }

    return (
    <div>
        {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
            <Navigate to={"/"}/>
        )}
        <h1>Notes</h1>
        {appState === APP_STATE_TYPE.loading && (
            <div>Loading...</div>
        )}
        {appState === APP_STATE_TYPE.active && (
            <div>
                <button className={styles.addButton} type="button" onClick={onAddNew}>Add new</button>
                {notes.map((note) => (
                    <NoteItem
                        key={note.id}
                        id={note.id}
                        header={note.header}
                        modifiedAt={note.modifiedAt}
                        createdAt={note.createdAt}
                        owner={note.owner}
                    />
                ))}
            </div>
        )} 
    </div>
        
    );
};

export default Notes;