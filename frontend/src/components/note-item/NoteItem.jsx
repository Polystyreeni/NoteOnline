import { useDispatch, useSelector } from "react-redux";
import { millisToDate } from "../../utility/dateHelper";
import { AUTH_ROLE_TYPE } from "../../store/actionTypes";
import { useNavigate } from "react-router-dom";
import { setActiveNoteThunk } from "../../store/actionCreators/thunks/ActiveNote";
import { Delete } from "@mui/icons-material";
import { Box, IconButton, Link, ListItem, Typography } from "@mui/material";

const NoteItem = ({id, header, modifiedAt, createdAt, owner, onDelete}) => {

    const activeNote = useSelector((state) => state.activeNote);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);

    function openNote(e) {
        if (activeNote.id !== id) {
            dispatch(setActiveNoteThunk(id));
        }
        
        navigate(`/notes/${id}`);
    }

    function deleteNote() {
        onDelete(id);
    }

    return (
        <ListItem divider={true}>
            <Box>
                <Link component="button" variant="h6" underline="hover" onClick={openNote}>{header}</Link>
                <Typography variant="body2">{`Modified at: ${millisToDate(modifiedAt)}`}</Typography>
                <Typography variant="body2">{`Created at: ${millisToDate(createdAt)}`}</Typography>
                {auth.roles.includes(AUTH_ROLE_TYPE.admin) && (
                    <Typography variant="body1">{`Owned by user: ${owner}`}</Typography>
                )}
            </Box>
            <IconButton  type="delete" onClick={deleteNote}>
                <Delete />
            </IconButton>
        </ListItem>
    );
};

export default NoteItem;