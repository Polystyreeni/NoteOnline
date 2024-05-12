package fi.tuni.sepro.noteonline.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

import fi.tuni.sepro.noteonline.models.User;
import fi.tuni.sepro.noteonline.repository.UserRepository;

@Component
public class AuthEventListener {

    @Value("${noteonline.app.accountLockMin}")
    private int lockCountMin;

    @Value("${noteonline.app.accountLockMax}")
    private int lockCountHigh;

    @Value("${noteonline.app.accountLockMinPenalty}")
    private long lockDurationMin;

    @Value("${noteonline.app.accountLockMaxPenalty}")
    private long lockDurationHigh;

    @Autowired
    private UserRepository userRepository;
    
    /**
     * Listens for failed authentications, and disables further login attempts if too many failures
     * occur
     * @param event Failed authentication event
     */
    @EventListener
    public void authenticationFailed(AuthenticationFailureBadCredentialsEvent event) {
        String email = (String)event.getAuthentication().getPrincipal();

        User user = userRepository.findUserByEmail(email);
        if (user != null) {
            int loginCount = user.getFailedLoginCount() + 1;
            long lockedUntil = 0;

            user.setFailedLoginCount(loginCount);
            
            if (loginCount >= lockCountHigh) {
                lockedUntil = System.currentTimeMillis() + lockDurationHigh;
            }
            else if (loginCount >= lockCountMin) {
                lockedUntil = System.currentTimeMillis() + lockDurationMin;
            }

            user.setFailedLoginCount(loginCount);
            user.setLockedUntil(lockedUntil);

            userRepository.save(user);
        }
    }
}
