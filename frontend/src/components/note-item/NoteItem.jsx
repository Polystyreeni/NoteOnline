import { useDispatch, useSelector } from "react-redux";
import { millisToDate } from "../../utility/dateHelper";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { useNavigate } from "react-router-dom";
import { setActiveNoteThunk } from "../../store/actionCreators/thunks/ActiveNote";
import { deleteNoteThunk } from "../../store/actionCreators/thunks/Note";
import styles from "./NoteItem.module.css";

const NoteItem = ({id, header, modifiedAt, createdAt, owner}) => {

    const activeNote = useSelector((state) => state.activeNote);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);

    function openNote(e) {
        if (activeNote.id !== id) {
            console.log(id);
            dispatch(setActiveNoteThunk(id));
        }
        
        navigate(`/notes/${id}`);
    }

    function deleteNote(e) {
        dispatch(deleteNoteThunk(id));
    }

    return (
        <div className={styles.noteItem}>
            <div className={styles.header}>{header}</div>
            <div>{`Modified at: ${millisToDate(modifiedAt)}`}</div>
            <div>{`Created at: ${millisToDate(createdAt)}`}</div>
            {auth.roles.includes(AUTH_ROLE_TYPE.admin) && (
                <div>{`Owned by user: ${owner}`}</div>
            )}
            <button type="button" onClick={openNote}>Open</button>
            <button type="delete" onClick={deleteNote}>Delete</button>
        </div>
    );
};

export default NoteItem;