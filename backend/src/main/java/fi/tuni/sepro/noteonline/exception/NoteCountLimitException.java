package fi.tuni.sepro.noteonline.exception;

public class NoteCountLimitException extends Exception {
    public NoteCountLimitException(String msg) {
        super(msg);
    }
}
