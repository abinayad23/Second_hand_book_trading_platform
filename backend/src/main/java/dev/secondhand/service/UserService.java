package dev.secondhand.service;

import dev.secondhand.model.User;
import dev.secondhand.repo.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User u, boolean active) {
        u.setPasswordHash(passwordEncoder.encode(u.getPasswordHash()));
        u.setStatus(active ? User.Status.ACTIVE : User.Status.PENDING_APPROVAL);
        return userRepository.save(u);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        GrantedAuthority ga = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());
        return new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPasswordHash(), Collections.singleton(ga));
    }
}