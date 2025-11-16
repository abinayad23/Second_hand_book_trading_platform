package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Ensure user is enabled (verified)
        boolean enabled = user.getIsVerified() != null && user.getIsVerified();
        
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole() != null ? user.getRole() : "STUDENT") // Default to STUDENT if role is null
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(!enabled)
            .build();
    }
}