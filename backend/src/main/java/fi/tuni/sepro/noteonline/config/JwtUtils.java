package fi.tuni.sepro.noteonline.config;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.server.Cookie.SameSite;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import fi.tuni.sepro.noteonline.services.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    // JWT configuration: Edit these to your application
    private final String jwtCookieName = "noteonline";
    private final String jwtSecret = "superSecretApplicationJWTKeyThatShouldBeLongEnough";
    private final int jwtExpirationMs = 86400000;
    
    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookieName);
        if (cookie != null) {
            return cookie.getValue();
        }

        return null;
    }

    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUserName(userPrincipal.getUsername());
        ResponseCookie cookie = ResponseCookie.from(jwtCookieName, jwt).path("/api")
            .maxAge(24 * 60 * 60)
            .httpOnly(true)
            .sameSite(SameSite.LAX.name())
            .build();
        return cookie;
    }

    public ResponseCookie getCleanJwtCookie() {
        ResponseCookie cookie = ResponseCookie.from(jwtCookieName, null)
            .path("/api")
            .sameSite(SameSite.LAX.name())
            .build();
        return cookie;
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith((SecretKey)getKey()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public String getUserNameFromToken(String token) {
        return Jwts.parser().verifyWith((SecretKey)getKey()).build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public String generateTokenFromUserName(String username) {
        Date currentDate = new Date();
        return Jwts.builder()
            .subject(username)
            .issuedAt(currentDate)
            .expiration(new Date(currentDate.getTime() + jwtExpirationMs))
            .signWith(getKey())     // JWT will automatically sign with HS256
            .compact();
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}