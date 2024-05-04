package fi.tuni.sepro.noteonline.utils;

public class NoteUtils {

    private static final int HEADER_MAX_LENGTH = 64;
    private static final int CONTENT_MAX_LENGTH = 5000;
    
    /**
     * Validate note header. Currently only needs to check lengt.
     * @param header Note header
     * @return True if valid, false otherwise
     */
    public static boolean isValidHeader(String header) {
        if (header.length() <= 0 || header.length() > HEADER_MAX_LENGTH)
            return false;
            
        return true;
    }

    /**
     * Validate note content. Currenly only needs to check length.
     * @param content Note content
     * @return True if valid, false otherwise
     */
    public static boolean isValidContent(String content) {
        if (content.length() <= 0 || content.length() > CONTENT_MAX_LENGTH)
            return false;

        return true;
    }
}
