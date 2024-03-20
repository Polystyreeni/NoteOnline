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

    //public RegisterDto() {};

    //public String getEmail() {return this.email;}
    //public String getPassword() {return this.password;}
    //public String getPasswordRepeat() {return this.passwordRepeat;}
    //public void setEmail(String email) {this.email = email;}
    //public void setPassword(String password) {this.password = password;}
    //public void setPasswordRepeat(String passwordRepeat) {this.passwordRepeat = passwordRepeat;}
}
