package fi.tuni.sepro.noteonline.utils;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class EncryptionUtils {

    private static final String ENCRYPTION_ALGORITHM = "AES";

    // For valid values, see: https://docs.oracle.com/javase/8/docs/api/javax/crypto/Cipher.html
    private static final String ENCRYPTION_SETTING = "AES/CBC/PKCS5Padding";
    private static final int IV_SIZE = 16;

    // PBKDF parameters
    private static final String PBKDF_ALRORITHM = "PBKDF2WithHmacSHA256";
    private static final int PBKDF_ITERATIONS = 65536;
    private static final int PBKDF_KEY_LENGTH = 256;

    /**
     * Generates a secret key for encryption
     * @param size The key size in bits
     * @return Generated secret key
     * @throws NoSuchAlgorithmException
     * @throws InvalidParameterException
     */
    public static SecretKey generateKey(int size) throws NoSuchAlgorithmException, InvalidParameterException {
        KeyGenerator generator = KeyGenerator.getInstance(ENCRYPTION_ALGORITHM);
        generator.init(size);
        SecretKey key = generator.generateKey();
        return key;
    }

    /**
     * Generate a secret key for encryption from a password
     * @param pass The password as plain text
     * @param salt A random salt
     * @return Generated secret key
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public static SecretKey generateKeyFromPassword(String pass, String salt) 
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecretKeyFactory factory = SecretKeyFactory.getInstance(PBKDF_ALRORITHM);
        KeySpec spec = new PBEKeySpec(pass.toCharArray(), salt.getBytes(), PBKDF_ITERATIONS, PBKDF_KEY_LENGTH);
        SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), ENCRYPTION_ALGORITHM);
        return key;
    }

    /**
     * Generate cryptographically random salt string
     * @param length The length of salt in bytes
     * @return The generated salt
     */
    public static String generateSalt(int length) {
        byte[] salt = new byte[length];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        String saltStr = new String(salt);

        // Possible null bytes need to be removed due to encoding issues
        saltStr = saltStr.replace("\u0000", "A");
        return saltStr;
    }

    /**
     * Generate cryptographically random salt bytes
     * @param length The length of salt in bytes
     * @return The generated salt
     */
    public static byte[] generateSaltBytes(int length) {
        byte[] salt = new byte[length];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        return salt;
    }

    /**
     * Convert a secret key to string format
     * @param key The secret key
     * @return SecretKey as String
     */
    public static String keyToString(SecretKey key) {
        byte[] data = key.getEncoded();
        String encoded = Base64.getEncoder().encodeToString(data);
        return encoded;
    }

    /**
     * Converts a string representing a SecretKey to a secret key object
     * @param keyStr The string of key
     * @return SecretKey object from input string
     */
    public static SecretKey stringToKey(String keyStr) {
        byte[] decoded = Base64.getDecoder().decode(keyStr);
        SecretKey key = new SecretKeySpec(decoded, 0, decoded.length, ENCRYPTION_ALGORITHM);
        return key;
    }

    /**
     * Generates an initialization vector for encryption
     * @return the generated IV
     */
    public static IvParameterSpec generateIv() {
        byte[] iv = new byte[IV_SIZE];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    /**
     * Generates an initialization vector for encryption from a given IV string
     * @param iv The string representation of the IV
     * @return the generated IV
     */
    public static IvParameterSpec generateIv(String iv) {
        return new IvParameterSpec(iv.getBytes());
    }

    /**
     * Encrypts an input string and converts it to Base64 string
     * @param input The content to encrypt
     * @param key The key used for encryption
     * @param iv The initialization vector used for encryption
     * @return The encrypted content as String
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     * @throws InvalidKeyException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     */
    public static String encryptToString(String input, SecretKey key, IvParameterSpec iv) 
        throws NoSuchAlgorithmException, NoSuchPaddingException, 
            InvalidKeyException, InvalidAlgorithmParameterException, 
            IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = Cipher.getInstance(ENCRYPTION_SETTING);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] cipherText = cipher.doFinal(input.getBytes());
        return Base64.getEncoder().encodeToString(cipherText);
    }

    /**
     * Encrypts an input string and converts it to encrypted byte array
     * @param input The content to encrypt
     * @param key The key used for encryption
     * @param iv The initialization vector used for encryption
     * @return The encrypted content as bytes
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     * @throws InvalidKeyException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     */
    public static byte[] encryptToBytes(String input, SecretKey key, IvParameterSpec iv)
        throws NoSuchAlgorithmException, NoSuchPaddingException, 
            InvalidKeyException, InvalidAlgorithmParameterException, 
            IllegalBlockSizeException, BadPaddingException {

        Cipher cipher = Cipher.getInstance(ENCRYPTION_SETTING);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] cipherText = cipher.doFinal(input.getBytes());
        return cipherText;
    }

    /**
     * Decrypts a given input cipher, using encryption settings provided in EncryptionUtils
     * @param cipherText The cipher text to decrypt
     * @param key The key used for decryption
     * @param iv The initialization vector used for decryption
     * @return The decrypted plaintext as String
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     * @throws InvalidKeyException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     */
    public static String decryptString(String cipherText, SecretKey key, IvParameterSpec iv) throws NoSuchAlgorithmException, 
            NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, 
            IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = Cipher.getInstance(ENCRYPTION_SETTING);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);

        byte[] decoded = Base64.getDecoder().decode(cipherText);
        byte[] plainText = cipher.doFinal(decoded);
        return new String(plainText);
    }

    /**
     * Decrypts a given input cipher given in bytes
     * @param cipherBytes bytes of cipher content
     * @param key The key used for decryption
     * @param iv Initialization vector used for decryption
     * @return The decrypted content as string
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     * @throws InvalidKeyException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     */
    public static String decryptBytes(byte[] cipherBytes, SecretKey key, IvParameterSpec iv) 
        throws NoSuchAlgorithmException, 
        NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, 
        IllegalBlockSizeException, BadPaddingException {
    
        Cipher cipher = Cipher.getInstance(ENCRYPTION_SETTING);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
    
        byte[] plainText = cipher.doFinal(cipherBytes);
        return new String(plainText);
    }
}
