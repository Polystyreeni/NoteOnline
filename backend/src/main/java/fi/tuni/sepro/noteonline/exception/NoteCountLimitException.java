package fi.tuni.sepro.noteonline.exception;

/**
 * Exception thrown when the user attempts to post a file, but they are already at their limit
 */
public class NoteCountLimitException extends Exception {
    public NoteCountLimitException(String msg) {
        super(msg);
    }
}
