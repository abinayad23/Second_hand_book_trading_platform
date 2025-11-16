package edu.gct.campusLink.bean;

import java.time.LocalDate;

public class AuthRequest {
    private String email;
    private String registerNumber;
    private LocalDate dateOfBirth;
    private Boolean isFirstYear;
    private String department;
    private String name;
    private String phone;
    private String location;
    private String password; // ✅ Add this field

    // Getters
    public String getEmail() { return email; }
    public String getRegisterNumber() { return registerNumber; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public Boolean getIsFirstYear() { return isFirstYear; }
    public String getDepartment() { return department; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getPassword() { return password; } // ✅ Add this getter

    // Setters (optional)
    public void setEmail(String email) { this.email = email; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setIsFirstYear(Boolean isFirstYear) { this.isFirstYear = isFirstYear; }
    public void setDepartment(String department) { this.department = department; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLocation(String location) { this.location = location; }
    public void setPassword(String password) { this.password = password; } // ✅ Add this setter
}