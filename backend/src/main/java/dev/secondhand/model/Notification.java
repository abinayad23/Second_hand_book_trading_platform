package dev.secondhand.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="user_id") private Long userId;
    private String type;
    @Column(columnDefinition = "TEXT") private String payload;
    @Column(name="read_flag") private Boolean readFlag = false;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public Boolean getReadFlag() { return readFlag; }
    public void setReadFlag(Boolean readFlag) { this.readFlag = readFlag; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}