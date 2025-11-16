package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.bean.AuthRequest;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OTPService otpService;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, OTPService otpService, EmailService emailService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public String initiateRegistration(AuthRequest request) {
        if (Boolean.TRUE.equals(request.getIsFirstYear())) {
            // First-year → OTP to mobile
            if (request.getPhone() == null || request.getPhone().isBlank()) {
                throw new IllegalArgumentException("Mobile number is required for first-year users");
            }
            String otp = otpService.generateOTP(request.getPhone());
            // TODO: Send SMS (not implemented yet)
            return "OTP sent to phone: " + otp;
        } else {
            // Not first-year → OTP to email
            if (request.getEmail() == null || !request.getEmail().contains("@")) {
                throw new IllegalArgumentException("Valid email is required for non–first-year users");
            }
            String otp = otpService.generateOTP(request.getEmail());
            emailService.sendOTPEmail(request.getEmail(), otp);
            return "OTP sent to email";
        }
    }

    @Override
    public User completeRegistration(AuthRequest request, String enteredOtp) {
        System.out.println("========================================");
        System.out.println("COMPLETE REGISTRATION CALLED:");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Name: " + request.getName());
        System.out.println("OTP: " + enteredOtp);
        System.out.println("========================================");
        
    	Boolean isFirstYear = request.getIsFirstYear();
        String otpKey = isFirstYear ? request.getPhone() : request.getEmail();
        
        System.out.println("OTP Key: " + otpKey);
        System.out.println("Is First Year: " + isFirstYear);
        
    	// Verify OTP and remove it after successful registration
    	System.out.println("Verifying OTP...");
    	boolean otpValid = otpService.verifyOTP(otpKey, enteredOtp, true);
    	System.out.println("OTP Valid: " + otpValid);
    	
    	if (!otpValid) {
            System.err.println("❌ OTP verification failed!");
            throw new IllegalArgumentException("Invalid or expired OTP");
        }
        
        System.out.println("✅ OTP verified successfully");

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setIsFirstYear(request.getIsFirstYear() != null ? request.getIsFirstYear() : false);
        user.setRegisterNumber(request.getRegisterNumber());
        user.setIsVerified(true);
        
        // Set role (default to STUDENT if not provided)
        user.setRole("STUDENT");

        if (request.getIsFirstYear() != null && request.getIsFirstYear()) {
            user.setUsername(request.getRegisterNumber());
        } else {
            user.setUsername(request.getEmail());
        }

        // Use provided password or default
        String password = request.getPassword() != null && !request.getPassword().isBlank() 
            ? request.getPassword() 
            : request.getDateOfBirth() != null ? request.getDateOfBirth().toString() : "default123";
        
        System.out.println("Setting password (encrypted)...");
        user.setPassword(passwordEncoder.encode(password));
        
        // Ensure user is verified and enabled after registration
        user.setIsVerified(true);
        
        System.out.println("Saving user to database...");
        User savedUser = userRepository.save(user);
        
        System.out.println("✅ User saved with ID: " + savedUser.getId());
        System.out.println("✅ User is verified: " + savedUser.getIsVerified());
        System.out.println("========================================");
        
        return savedUser;
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow();
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getDepartment() != null) user.setDepartment(updatedUser.getDepartment());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getLocation() != null) user.setLocation(updatedUser.getLocation());
        if (updatedUser.getProfileImagePath() != null) user.setProfileImagePath(updatedUser.getProfileImagePath());
        if (updatedUser.getIsVerified() != null) user.setIsVerified(updatedUser.getIsVerified());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}