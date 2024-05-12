package fi.tuni.sepro.noteonline.services;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import fi.tuni.sepro.noteonline.dto.NoteDetailsResponseDto;
import fi.tuni.sepro.noteonline.dto.NoteResponseDto;
import fi.tuni.sepro.noteonline.exception.NoteCountLimitException;
import fi.tuni.sepro.noteonline.exception.NoteDecryptionException;
import fi.tuni.sepro.noteonline.exception.NoteEncryptionException;
import fi.tuni.sepro.noteonline.models.Note;
import fi.tuni.sepro.noteonline.repository.NoteRepository;
import fi.tuni.sepro.noteonline.utils.EncryptionUtils;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    @Value("${noteonline.app.maxNotesPerUser}")
    private int maxNotesPerUser;

    NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    /**
     * Get all notes in encrypted format
     * @return List of encrypted notes
     */
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    /**
     * Gets all note details. Header is in ecnrypted form.
     * @return List of note details
     */
    public List<NoteDetailsResponseDto> getAllNoteDetails() {
        List<Note> notes = noteRepository.findAll();
        return notes.stream().map(note -> createDetailsResponse(note)).collect(Collectors.toList());
    }

    /**
     * Gets all notes by given user. Notes are in encrypted form
     * @param userId note owner
     * @return List of encrypted notes
     */
    public List<Note> getNotesByUser(Long userId) {
        return noteRepository.findByOwner(userId);
    }

    /**
     * Gets note details (= everything except note content) in decrypted format
     * @param userId note owner
     * @param encKey decryption key
     * @return list of note details
     */
    public List<NoteDetailsResponseDto> getNoteDetailsByUser(Long userId, String encKey) {
        List<Note> notes = noteRepository.findByOwner(userId);
        return notes.stream().map(note -> createDetailsResponseDecrypted(note, encKey))
            .collect(Collectors.toList());
    }

    /**
     * Create a new encrypted note from plaintext input note
     * @param note unencrypted note data, with encryption key provided
     * @return Encrypted note
     * @throws NoteCountLimitException user max notes reached, see maxNotesPerUser setting
     * @throws NoteEncryptionException note encryption fails
     */
    public Note createNote(Note note) throws NoteCountLimitException, NoteEncryptionException {

        List<Note> notesByUser = noteRepository.findByOwner(note.getOwner());
        if (notesByUser.size() >= maxNotesPerUser) {
            throw new NoteCountLimitException("Maximum number of notes added");
        }

        note.setCreatedAt(System.currentTimeMillis());
        note.setModifiedAt(System.currentTimeMillis());
        try {
            encryptNote(note);
        } catch (Exception e) {
            throw new NoteEncryptionException(e.getMessage());
        }

        return noteRepository.save(note);
    }

    /**
     * Find note with the given id
     * @param id id of note
     * @return encrypted note
     */
    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Note was not found!"));
    }

    /**
     * Find note with the given id, in decrypted format
     * @param id note id
     * @param decKey decryption key
     * @return decrypted note
     * @throws NoteDecryptionException note decryption fails
     */
    public Note getNoteByIdDecrypted(Long id, String decKey) throws NoteDecryptionException {
        Note note = noteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Note was not found!"));

        try {
            decryptNote(note, decKey);
        }
        catch (Exception e) {
            throw new NoteDecryptionException(e.getMessage());
        }

        return note;
    }

    /**
     * Updates existing note to the database in an encrypted format
     * @param id Note id to update
     * @param newNote New note data in plain format
     * @return Encrypted note
     */
    public Note updateNote(Long id, Note newNote) {
        Note existingNote = noteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Note was not found"));
        
        existingNote.setHeader(newNote.getHeader());
        existingNote.setContent(newNote.getContent());

        // Update timestamp of note
        existingNote.setModifiedAt(System.currentTimeMillis());
        existingNote.setEncryptionKey(newNote.getEncryptionKey());

        // Encrypt note
        try {
            encryptNote(existingNote);
            return noteRepository.save(existingNote);
        }
        catch (Exception e) {
            throw new IllegalArgumentException("Note could not be encrypted");
        }
    }
    
    /**
     * Deletes note with given id
     * @param id note id to delete
     */
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    /**
     * Creates a note response object from the given note
     * @param note Note object following the db schema
     * @return Note without iv, salt and encryption key params
     */
    public NoteResponseDto createResponse(Note note) {
        return new NoteResponseDto(
            note.getId(),
            note.getOwner(),
            note.getCreatedAt(),
            note.getModifiedAt(),
            new String(note.getHeader()),
            new String(note.getContent())
        );
    }

    /**
     * Generates note details response from the given note, header encrypted
     * @param note Note to get details from
     * @return Note details with encrypted header
     */
    public NoteDetailsResponseDto createDetailsResponse(Note note) {
        return new NoteDetailsResponseDto(
            note.getId(),
            note.getOwner(),
            note.getCreatedAt(),
            note.getModifiedAt(),
            new String(note.getHeader())
        );
    }

    /**
     * Gets note details from the given note, attempts to decrypt header
     * @param note Note to get details from
     * @param encKey Note encryption key provided by the user
     * @return Note details with decrypted header, if possible, encrypted if fails
     */
    private NoteDetailsResponseDto createDetailsResponseDecrypted(Note note, String encKey) {
        try {
            byte[] decodedIv = note.getIv();
            byte[] salt = note.getSalt();
            
            IvParameterSpec iv = new IvParameterSpec(decodedIv);
            SecretKey keyDecryptKey = EncryptionUtils.generateKeyFromPassword(encKey, salt);
            byte[] fileKeyBytes = EncryptionUtils.decryptBytes(note.getEncryptionKey(), keyDecryptKey, iv);

            SecretKey fileKey = EncryptionUtils.bytesToKey(fileKeyBytes);
            byte[] decryptedHeader = EncryptionUtils.decryptBytes(note.getHeader(), fileKey, iv);

            return new NoteDetailsResponseDto(note.getId(), 
                note.getOwner(), 
                note.getCreatedAt(), 
                note.getModifiedAt(), 
                new String(decryptedHeader));
        } 
        // If encryption fails, return encrypted notes instead
        catch (Exception e) {
            return createDetailsResponse(note);
        }
    }

    /**
     * Encrypts the given note. 
     * @param note plaintext note, with encryption key set
     * @throws InvalidParameterException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     * @throws NoSuchPaddingException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     * @throws InvalidKeySpecException
     */
    private void encryptNote(Note note) throws 
            InvalidParameterException, NoSuchAlgorithmException, 
            InvalidKeyException, NoSuchPaddingException, 
            InvalidAlgorithmParameterException, IllegalBlockSizeException, 
            BadPaddingException, InvalidKeySpecException {

        byte[] encKey = note.getEncryptionKey();

        // Encrypt file contents with a random file key
        IvParameterSpec iv = EncryptionUtils.generateIv();
        SecretKey fileKey = EncryptionUtils.generateKey(128);
        byte[] encryptedHeader = EncryptionUtils.encryptToBytes(note.getHeader(), fileKey, iv);
        byte[] encryptedBody = EncryptionUtils.encryptToBytes(note.getContent(), fileKey, iv);
        
        // Encrypt the file key with users encryption key
        byte[] salt = EncryptionUtils.generateSaltBytes(16);
        SecretKey keyEncryptionKey = EncryptionUtils.generateKeyFromPassword(new String(encKey), salt);
        byte[] encryptedKey = EncryptionUtils.encryptToBytes(fileKey.getEncoded(), keyEncryptionKey, iv);

        // Assign note content
        note.setHeader(encryptedHeader);
        note.setContent(encryptedBody);
        note.setEncryptionKey(encryptedKey);
        note.setSalt(salt);
        note.setIv(iv.getIV());
    }

    /**
     * Decrypts the given note
     * @param note note data to decrypt
     * @param key decryption key
     * @throws InvalidParameterException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     * @throws NoSuchPaddingException
     * @throws InvalidAlgorithmParameterException
     * @throws IllegalBlockSizeException
     * @throws BadPaddingException
     * @throws InvalidKeySpecException
     */
    private void decryptNote(Note note, String key) throws 
            InvalidParameterException, NoSuchAlgorithmException, 
            InvalidKeyException, NoSuchPaddingException, 
            InvalidAlgorithmParameterException, IllegalBlockSizeException, 
            BadPaddingException, InvalidKeySpecException {
            
        // Generate file key decryption key
        byte[] decodedIv = note.getIv();
        byte[] salt = note.getSalt();
        IvParameterSpec iv = new IvParameterSpec(decodedIv);
        SecretKey keyDecryptKey = EncryptionUtils.generateKeyFromPassword(key, salt);
        
        // Get decrypted file key
        byte[] fileKeyBytes = EncryptionUtils.decryptBytes(note.getEncryptionKey(), keyDecryptKey, iv);
        SecretKey fileKey = EncryptionUtils.bytesToKey(fileKeyBytes);

        // Decrypt file contents with file key
        byte[] decryptedHeader = EncryptionUtils.decryptBytes(note.getHeader(), fileKey, iv);
        byte[] decryptedContent = EncryptionUtils.decryptBytes(note.getContent(), fileKey, iv);

        note.setHeader(decryptedHeader);
        note.setContent(decryptedContent);
    }
}
