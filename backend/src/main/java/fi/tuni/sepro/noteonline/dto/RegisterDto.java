package fi.tuni.sepro.noteonline.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterDto {
    private String email;
    private String password;
    private String passwordRepeat;
}
