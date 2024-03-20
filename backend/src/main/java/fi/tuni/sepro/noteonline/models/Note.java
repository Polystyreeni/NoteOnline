package fi.tuni.sepro.noteonline.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notes")
@EqualsAndHashCode(callSuper = false)
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @NotEmpty(message = "Note must have an owner")
    private long owner;
    private long createdAt;
    private long modifiedAt;

    private String header;
    private String content;
}
