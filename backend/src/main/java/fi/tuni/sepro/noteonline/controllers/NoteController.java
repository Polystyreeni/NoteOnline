package fi.tuni.sepro.noteonline.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.tuni.sepro.noteonline.config.SecurityConfig;
import fi.tuni.sepro.noteonline.dto.NoteCreateRequestDto;
import fi.tuni.sepro.noteonline.dto.NoteDetailsResponseDto;
import fi.tuni.sepro.noteonline.models.ERole;
import fi.tuni.sepro.noteonline.models.Note;
import fi.tuni.sepro.noteonline.services.NoteService;
import fi.tuni.sepro.noteonline.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    public ResponseEntity<List<NoteDetailsResponseDto>> getAllNoteDetails() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();
        
        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        // For non-admin users, only return notes that the user has created
        List<NoteDetailsResponseDto> notes;
        if (!roles.contains(ERole.ROLE_ADMIN.name())) {
            notes = noteService.getNoteDetailsByUser(userDetails.getId());
        }

        else {
            notes = noteService.getAllNoteDetails();
        }

        return ResponseEntity.ok(notes);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    public ResponseEntity<Note> createNote(@RequestBody NoteCreateRequestDto noteData, @CookieValue(name="encKey", defaultValue = "") String encKey) {
        Note note = new Note();
        note.setOwner(noteData.getOwner());
        note.setHeader(noteData.getHeader());
        note.setContent(noteData.getContent());
        note.setEncryptionKey(encKey);
        
        Note createdNote = noteService.createNote(note);

        // Return unencrypted content back to user
        note.setContent(noteData.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    public ResponseEntity<?> getNoteById(@PathVariable Long id, @CookieValue(name="encKey", defaultValue = "") String encKey) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        Note note = noteService.getNoteById(id);

        // Users have only access to their own notes, which will be decrypted
        if (!roles.contains(ERole.ROLE_ADMIN.name())) {
             if (note.getOwner() != userDetails.getId()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new String("Unauthorized access to note!"));
             }
             else {
                try {
                    if (encKey.isBlank())
                        throw new Exception("No encryption cookie received in request!");
                    Note decrypted = noteService.getNoteByIdDecrypted(id, encKey);
                    return ResponseEntity.ok(decrypted);
                } 
                catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new String(e.getMessage()));
                }
             }
        }
        else {
            // Admins only get encrypted note
            return ResponseEntity.ok(note);
        }        
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    public ResponseEntity<?> updateNote(
        @PathVariable Long id, 
        @RequestBody NoteCreateRequestDto details, 
        @CookieValue(name = "encKey", defaultValue = "") String encKey) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();
        
        // Anyone can only update their own notes
        Note note = noteService.getNoteById(id);
        if (note.getOwner() != userDetails.getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new String("Unauthorized update!")); 
        }
        Note toUpdate = new Note();
        toUpdate.setOwner(details.getOwner());
        toUpdate.setHeader(details.getHeader());
        toUpdate.setContent(details.getContent());
        toUpdate.setEncryptionKey(encKey);
        
        Note updatedNote = noteService.updateNote(id, toUpdate);

        // Return unencrypted content to user
        updatedNote.setContent(details.getContent());

        return ResponseEntity.ok(updatedNote);    
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        // Users can only delete their own notes
        if (!roles.contains(ERole.ROLE_ADMIN.name())) {
            Note note = noteService.getNoteById(id);
            if (note.getOwner() != userDetails.getId()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new String("Unauthorized delete!"));
            }
            noteService.deleteNote(id);
            return ResponseEntity.ok(id);
        } 
        // Admins can delete any note
        else {
            noteService.deleteNote(id);
            return ResponseEntity.ok(id);
        }
    }
}
