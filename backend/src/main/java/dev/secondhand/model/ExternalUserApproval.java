package dev.secondhand.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="external_user_approvals")
public class ExternalUserApproval {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name="user_id") private Long userId;
    @Column(name="admin_id") private Long adminId;
    private Boolean approved = false;
    private String notes;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getUserId(){return userId;} public void setUserId(Long userId){this.userId=userId;}
    public Long getAdminId(){return adminId;} public void setAdminId(Long adminId){this.adminId=adminId;}
    public Boolean getApproved(){return approved;} public void setApproved(Boolean approved){this.approved=approved;}
    public String getNotes(){return notes;} public void setNotes(String notes){this.notes=notes;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime createdAt){this.createdAt=createdAt;}
}