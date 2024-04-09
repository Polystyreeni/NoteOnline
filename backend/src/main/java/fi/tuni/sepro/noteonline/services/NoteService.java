package fi.tuni.sepro.noteonline.services;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

import org.springframework.stereotype.Service;

import fi.tuni.sepro.noteonline.dto.NoteDetailsResponseDto;
import fi.tuni.sepro.noteonline.models.Note;
import fi.tuni.sepro.noteonline.repository.NoteRepository;
import fi.tuni.sepro.noteonline.utils.EncryptionUtils;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public List<NoteDetailsResponseDto> getAllNoteDetails() {
        List<Note> notes = noteRepository.findAll();
        return notes.stream().map(note -> new NoteDetailsResponseDto(
            note.getId(),
            note.getOwner(),
            note.getCreatedAt(),
            note.getModifiedAt(),
            note.getHeader()
        )).collect(Collectors.toList());
    }

    public List<Note> getNotesByUser(Long userId) {
        return noteRepository.findByOwner(userId);
    }

    public List<NoteDetailsResponseDto> getNoteDetailsByUser(Long userId) {
        List<Note> notes = noteRepository.findByOwner(userId);
        return notes.stream().map(note -> new NoteDetailsResponseDto(
            note.getId(), 
            note.getOwner(), 
            note.getCreatedAt(), 
            note.getModifiedAt(), 
            note.getHeader())).collect(Collectors.toList());
    }

    public Note createNote(Note note) {
        note.setCreatedAt(System.currentTimeMillis());
        note.setModifiedAt(System.currentTimeMillis());
        try {
            encryptNote(note);
        } catch (Exception e) {
            throw new IllegalArgumentException("Note could not be encrypted");
        }

        return noteRepository.save(note);
    }

    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Note was not found"));
    }

    public Note getNoteByIdDecrypted(Long id, String encKey) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Note was not found"));

        try {
            decryptNote(note, encKey);
        }
        catch (Exception e) {
            throw new IllegalArgumentException("Note could not be decrypted");
        }

        return note;
    }

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
    
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    private void encryptNote(Note note) throws 
            InvalidParameterException, NoSuchAlgorithmException, 
            InvalidKeyException, NoSuchPaddingException, 
            InvalidAlgorithmParameterException, IllegalBlockSizeException, 
            BadPaddingException, InvalidKeySpecException {

        String encKey = note.getEncryptionKey();

        // Encrypt file contents with a random file key
        IvParameterSpec iv = EncryptionUtils.generateIv();
        SecretKey fileKey = EncryptionUtils.generateKey(128);
        String encryptedBody = EncryptionUtils.encryptToString(note.getContent(), fileKey, iv);
        
        // Encrypt the file key with users encryption key
        String salt = EncryptionUtils.generateSalt(16);
        SecretKey keyEncryptionKey = EncryptionUtils.generateKeyFromPassword(encKey, salt);
        String keyAsStr = EncryptionUtils.keyToString(fileKey);
        String encryptedKey = EncryptionUtils.encryptToString(keyAsStr, keyEncryptionKey, iv);

        // TODO: Currently only encrypting content, could be extended to encrypt everything
        note.setContent(encryptedBody);
        note.setEncryptionKey(encryptedKey);
        note.setSalt(salt);
        note.setIv(Base64.getEncoder().encodeToString(iv.getIV()));
    }

    private void decryptNote(Note note, String key) throws 
            InvalidParameterException, NoSuchAlgorithmException, 
            InvalidKeyException, NoSuchPaddingException, 
            InvalidAlgorithmParameterException, IllegalBlockSizeException, 
            BadPaddingException, InvalidKeySpecException {
            
        // Decrypt file key
        byte[] decodedIv = Base64.getDecoder().decode(note.getIv());
        IvParameterSpec iv = new IvParameterSpec(decodedIv);
        String salt = note.getSalt();
        SecretKey keyDecryptKey = EncryptionUtils.generateKeyFromPassword(key, salt);
        String fileKeyStr = EncryptionUtils.decryptString(note.getEncryptionKey(), keyDecryptKey, iv);

        SecretKey fileKey = EncryptionUtils.stringToKey(fileKeyStr);
        String decryptedContent = EncryptionUtils.decryptString(note.getContent(), fileKey, iv);

        note.setContent(decryptedContent);
    }
}
