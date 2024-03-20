package fi.tuni.sepro.noteonline.services;

import java.util.List;

import org.springframework.stereotype.Service;

import fi.tuni.sepro.noteonline.models.Note;
import fi.tuni.sepro.noteonline.repository.NoteRepository;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public List<Note> getNodesByUser(Long userId) {
        return noteRepository.findByOwner(userId);
    }

    public Note createNote(Note note) {
        note.setCreatedAt(System.currentTimeMillis());
        note.setModifiedAt(System.currentTimeMillis());
        return noteRepository.save(note);
    }

    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Note was not found"));
    }

    public Note updateNote(Long id, Note newNote) {
        Note existingNote = noteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Note was not found"));
        
        existingNote.setHeader(newNote.getHeader());
        existingNote.setContent(newNote.getContent());

        // Update timestamp of note
        existingNote.setModifiedAt(System.currentTimeMillis());
        
        return noteRepository.save(existingNote);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}
