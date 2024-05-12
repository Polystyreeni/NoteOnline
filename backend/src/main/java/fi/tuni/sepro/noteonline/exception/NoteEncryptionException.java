package fi.tuni.sepro.noteonline.exception;

/**
 * Exception thrown when note decryption process fails
 */
public class NoteEncryptionException extends Exception {
    public NoteEncryptionException(String msg) {
        super(msg);
    }
}
