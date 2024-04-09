package fi.tuni.sepro.noteonline.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

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
    

    public static boolean isValidPassword(String password) {
        // TODO: Add checks for password
        return true;
    }

    public static boolean isValidEmail(String email) {
        // TODO: Add checks for email
        return true;
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
