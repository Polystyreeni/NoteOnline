package fi.tuni.sepro.noteonline.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoteDetailsResponseDto {
    private long id;
    private long ownerId;
    private long createdAt;
    private long modifiedAt;

    private String header;
}
