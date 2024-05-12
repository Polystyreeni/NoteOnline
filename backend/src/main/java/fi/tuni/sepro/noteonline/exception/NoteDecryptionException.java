package fi.tuni.sepro.noteonline.exception;

/**
 * Exception thrown when note encryption process fails
 */
public class NoteDecryptionException extends Exception {
    public NoteDecryptionException(String msg) {
        super(msg);
    }
}
