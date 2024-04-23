package fi.tuni.sepro.noteonline.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;

/** 
 * Password encoder used for storing login credentials
 * Current implementation uses scrypt for generating hashes, recommended by OWASP
 * 
 * NOTE: scrypt is currently not the recommended solution in Spring security
 * This is due to implementation challenges regarding parallelis and slowness
 * Spring security recommends bcrypt at the moment
 * 
 * Reasons scrypt was chosen:
 * - Password hash is generated from another hash, which is generated using Argon2. Meaning that
 *   the contents to be hashed are already more secured than plaintext
 * - Since this encoder is hashing hashes, it's very likely inputs are longer than 72 bytes, which is 
 *   the limit for bcrypt. 
 * 
 * 
 */
public class CustomPasswordEncoder implements PasswordEncoder {

    private final SCryptPasswordEncoder encoder;

    // Scrypt configuration
    private final int SCRYPT_CPU_COST = 65536;
    private final int SCRYPT_MEMORY_COST = 8;
    private final int SCRYPT_PARALLELIZATION = 1;
    private final int SCRYPT_KEY_LENGTH = 32;
    private final int SCRYPT_SALT_LENGTH = 16;

    public CustomPasswordEncoder() {
        encoder = new SCryptPasswordEncoder(SCRYPT_CPU_COST, SCRYPT_MEMORY_COST, 
            SCRYPT_PARALLELIZATION, SCRYPT_KEY_LENGTH, SCRYPT_SALT_LENGTH);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        return encoder.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
