package fi.tuni.sepro.noteonline.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponseDto {
    private long id;
    private long owner;
    private long createdAt;
    private long modifiedAt;
    
    private String header;
    private String content;
}
