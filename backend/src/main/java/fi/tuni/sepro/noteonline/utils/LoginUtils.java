package fi.tuni.sepro.noteonline.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;
import org.springframework.boot.web.server.Cookie.SameSite;
import org.springframework.http.ResponseCookie;

import fi.tuni.sepro.noteonline.dto.AuthDto;
import fi.tuni.sepro.noteonline.models.User;

public class LoginUtils {

    // Encryption cookie settings
    private static final String ENC_COOKIE_NAME = "encKey";

    // Tuning parameters for Argon2 key generation
    // For more info on these, see below:
    // https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/argon2/Argon2PasswordEncoder.html
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    private static final int A2_SALT_LENGTH = 16;
    private static final int A2_HASH_LENGTH = 32;
    private static final int A2_PARALLELISM = 1;
    private static final int A2_MEMORY = 1 << 14;
    private static final int A2_ITERATIONS = 2;
    

    /**
     * Checks if the given password enforces good password practices
     * @param password plain text password
     * @return true, if password is considered strong, false otherwise
     */
    public static boolean isValidPassword(String password) {
        final int minLength = 10;
        final int maxLength = 64;

        if (password.length() < minLength || password.length() > maxLength) {
            return false;
        }

        Pattern[] validators = new Pattern[] {
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).{10,64}$")
        };

        for (Pattern pattern : validators) {
            if (!pattern.matcher(password).matches()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if the given email is in valid format (according to OWASP standard)
     * @param email email address to check
     * @return true, if email is in valid format, false otherwise
     */
    public static boolean isValidEmail(String email) {
        return Pattern.compile("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")
            .matcher(email)
            .matches();
    }

    /**
     * Generates encryption key data for an existing user, based on the password
     * @param user The existing user (from the database)
     * @param pass The password used for generating the hash
     * @return Base64 encoded hash, with salt 
     */
    public static AuthDto generateLoginHash(User user, String pass) {

        byte[] salt = Base64.getDecoder().decode(user.getSalt());

        Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
            .withVersion(Argon2Parameters.ARGON2_VERSION_13)
            .withIterations(A2_ITERATIONS)
            .withMemoryAsKB(A2_MEMORY)
            .withParallelism(A2_PARALLELISM)
            .withSalt(salt);

        Argon2BytesGenerator verifier = new Argon2BytesGenerator();
        verifier.init(builder.build());
        byte[] result = new byte[A2_HASH_LENGTH];
        verifier.generateBytes(pass.getBytes(StandardCharsets.UTF_8), result, 0, result.length);

        String resultString = Base64.getEncoder().encodeToString(result);
        return new AuthDto(resultString, user.getSalt());
    }

    /**
     * Generate encryption key for a new user, based on the password
     * @param pass The password for generating the hash (plain text)
     * @return Base64 encoded hash with salt
     */
    public static AuthDto generateNewHash(String pass) {
        byte[] salt = EncryptionUtils.generateSaltBytes(A2_SALT_LENGTH);

        Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
            .withVersion(Argon2Parameters.ARGON2_VERSION_13)
            .withIterations(A2_ITERATIONS)
            .withMemoryAsKB(A2_MEMORY)
            .withParallelism(A2_PARALLELISM)
            .withSalt(salt);
        
        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(builder.build());
        byte[] result = new byte[A2_HASH_LENGTH];
        generator.generateBytes(pass.getBytes(StandardCharsets.UTF_8), result, 0, result.length);

        String resultString = Base64.getEncoder().encodeToString(result);
        String saltString = Base64.getEncoder().encodeToString(salt);
        return new AuthDto(resultString, saltString);
    }

    /**
     * Generates a browser cookie from the encryption key, which is sent to users upon login
     * @param passHash Encryption key in Base64 format
     * @return cookie with encryption key as data
     */
    public static ResponseCookie generateEncryptionCookie(String passHash) {
        String cookieData = passHash;
        ResponseCookie cookie = ResponseCookie.from(ENC_COOKIE_NAME, cookieData).path("/api")
            .maxAge(24 * 60 * 60)
            .httpOnly(true)
            .sameSite(SameSite.STRICT.name())
            .build();

        return cookie;
    }

    /**
     * Generates an empty cookie for encryption. This is sent to users upon logout.
     * @return Cookie with no data
     */
    public static ResponseCookie generateCleanEncryptionCookie() {
        ResponseCookie cookie = ResponseCookie.from(ENC_COOKIE_NAME, null)
            .path("/api")
            .httpOnly(true)
            .sameSite(SameSite.LAX.name())
            .build();

        return cookie;
    }  

    /**
     * Generate a new cookie with the given data. Used for refreshing the encryption cookie when re-entering the site
     * with valid credentials.
     * @param data Data from the previous cookie: the encryption key
     * @return New cookie with the same data as the previously valid cookie
     */
    public static ResponseCookie refreshEncryptionCookie(String data) {
        ResponseCookie cookie = ResponseCookie.from(ENC_COOKIE_NAME, data)
            .path("/api")
            .httpOnly(true)
            .sameSite(SameSite.STRICT.name())
            .maxAge(24 * 60 * 60)
            .build();

        return cookie;
    }
}
