package edu.gct.campusLink.bean;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String name;
    @Email @Column(unique = true) private String email;
    @NotBlank private String password;

    private String username;
    private String department;
    private String phone;
    private String location;
    private String profileImagePath;

    private String registerNumber;
    private Boolean isFirstYear;
    private LocalDate dateOfBirth;

    private Boolean isVerified = false;
    private Double rating = 0.0;
    private String role = "STUDENT";
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return isVerified; }

    // Getters and setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getProfileImagePath() { return profileImagePath; }
    public String getEmail() { return email; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public Boolean getIsFirstYear() { return isFirstYear; }
    public String getRegisterNumber() { return registerNumber; }
    public Boolean getIsVerified() { return isVerified; }
    public Double getRating() { return rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public void setName(String name) { this.name = name; }
    public void setDepartment(String department) { this.department = department; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLocation(String location) { this.location = location; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setUsername(String username) { this.username = username; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setIsFirstYear(Boolean isFirstYear) { this.isFirstYear = isFirstYear; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(() -> "ROLE_" + role);
    }

}