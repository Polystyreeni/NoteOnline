package fi.tuni.sepro.noteonline.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.tuni.sepro.noteonline.models.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwner(Long ownerId);
}
