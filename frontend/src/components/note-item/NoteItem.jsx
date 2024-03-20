import { millisToDate } from "../../utility/dateHelper";

const NoteItem = ({header, modifiedAt, createdAt}) => {

    return (
        <div>
            <div>{header}</div>
            <div>{`Modified at: ${millisToDate(modifiedAt)}`}</div>
            <div>{`Created at: ${millisToDate(createdAt)}`}</div>
        </div>
    );
};

export default NoteItem;