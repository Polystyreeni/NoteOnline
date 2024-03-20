import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { Navigate } from "react-router-dom";
import NoteItem from "../../components/note-item/NoteItem";
import { useEffect } from "react";
import { setNotesThunk } from "../../store/actionCreators/thunks/Note";

const Notes = () => {

    const dispatch = useDispatch();

    const auth = useSelector((state) => state.auth);
    const notes = useSelector((state) => state.notes);

    useEffect(() => {
        if (notes === undefined || notes.length < 1)
            dispatch(setNotesThunk());
    }, []);

    return (
    <div>
        {auth.roles.includes(AUTH_ROLE_TYPE.unregistered) && (
            <Navigate to={"/"}></Navigate>
        )}
        <h1>Notes</h1>
        {notes.map((note) => (
            <NoteItem
                key={note.id}
                header={note.header}
                modifiedAt={note.modifiedAt}
                createdAt={note.createdAt}
            />
        ))}
    </div>
        
    );
};

export default Notes;