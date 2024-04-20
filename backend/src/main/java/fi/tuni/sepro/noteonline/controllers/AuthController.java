package fi.tuni.sepro.noteonline.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.tuni.sepro.noteonline.config.JwtUtils;
import fi.tuni.sepro.noteonline.config.SecurityConfig;
import fi.tuni.sepro.noteonline.dto.AuthDto;
import fi.tuni.sepro.noteonline.dto.LoginDto;
import fi.tuni.sepro.noteonline.dto.RegisterDto;
import fi.tuni.sepro.noteonline.dto.UnregisteredResponseDto;
import fi.tuni.sepro.noteonline.dto.UserResponseDto;
import fi.tuni.sepro.noteonline.models.ERole;
import fi.tuni.sepro.noteonline.models.Role;
import fi.tuni.sepro.noteonline.models.User;
import fi.tuni.sepro.noteonline.repository.RoleRepository;
import fi.tuni.sepro.noteonline.repository.UserRepository;
import fi.tuni.sepro.noteonline.services.UserDetailsImpl;
import fi.tuni.sepro.noteonline.utils.LoginUtils;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    @GetMapping("/authstatus")
    public ResponseEntity<?> checkUserStatus(@CookieValue(name = "encKey", defaultValue = "") String encKey) {
        try {
            // If user encryption key is expired, they can't decrypt notes, so log out
            if (encKey.isBlank()) {
                throw new Exception("Encryption key expired");
            }
                
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();

            UserResponseDto response = new UserResponseDto(userDetails.getId(), 
            userDetails.getUsername(), 
            userDetails.getAuthorities().stream().map(item -> item.getAuthority()).collect(Collectors.toList()));

            // Generate a new cookies to refresh expiration date
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
            ResponseCookie encryptionCookie = LoginUtils.refreshEncryptionCookie(encKey);

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, encryptionCookie.toString())
                .body(response);
        }
        catch (Exception e) {
            // Return default user state to frontend
            UnregisteredResponseDto response = new UnregisteredResponseDto();
            response.setRoles(List.of(ERole.ROLE_NONE.name()));

            // Generate clean cookie
            ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
            ResponseCookie encCookie = LoginUtils.generateCleanEncryptionCookie();
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, encCookie.toString())
                .body(response);
        }
    }

    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto) {

        User user = userRepository.findUserByEmail(loginDto.getEmail());
        AuthDto passData = LoginUtils.generateLoginHash(user, loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail(), passData.getHash()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        ResponseCookie encryptionCookie = LoginUtils.generateEncryptionCookie(passData.getHash());

        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        // Return user object with id, email and roles
        UserResponseDto responseBody = new UserResponseDto(userDetails.getId(), userDetails.getUsername(), roles);
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .header(HttpHeaders.SET_COOKIE, encryptionCookie.toString())
            .body(responseBody);
    }

    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDto registerDto) {
        if (!LoginUtils.isValidPassword(registerDto.getPassword())) {
            return new ResponseEntity<>("Password is not valid!", HttpStatus.BAD_REQUEST);
        }

        if (!LoginUtils.isValidEmail(registerDto.getEmail()) || userRepository.findUserByEmail(registerDto.getEmail()) != null) {
            return new ResponseEntity<>("Email is not valid!", HttpStatus.BAD_REQUEST);
        }

        if (!registerDto.getPassword().equals(registerDto.getPasswordRepeat())) {
            return new ResponseEntity<>("Password and repeat do not match!", HttpStatus.BAD_REQUEST);
        }

        AuthDto passData = LoginUtils.generateNewHash(registerDto.getPassword());

        User user = new User();
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(passData.getHash()));
        user.setSalt(passData.getSalt());

        // Add user role to a new account by default
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByRoleName(ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Roles are not defined!"));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
        
        UnregisteredResponseDto response = new UnregisteredResponseDto();
        response.setRoles(List.of(ERole.ROLE_NONE.name()));
        
        return ResponseEntity.ok()
            .body(response);
    }

    @CrossOrigin(allowCredentials = "true", origins = SecurityConfig.CORS_ORIGIN)
    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie encryptionCookie = LoginUtils.generateCleanEncryptionCookie();
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .header(HttpHeaders.SET_COOKIE, encryptionCookie.toString())
            .body(new String("Logged out!"));
    }
}
