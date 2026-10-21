package br.com.foodkeeper.entity;

import br.com.foodkeeper.enums.AlertType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts", indexes = {
        @Index(name = "idx_alerts_batch", columnList = "batch_id"),
        @Index(name = "idx_alerts_read", columnList = "read_flag")
})
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertType type;

    @Column(nullable = false, length = 255)
    private String message;

    @Column(name = "read_flag", nullable = false)
    private Boolean read;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Alert() {}

    public Alert(Long id, Batch batch, AlertType type, String message, Boolean read, LocalDateTime createdAt) {
        this.id = id; this.batch = batch; this.type = type; this.message = message;
        this.read = read; this.createdAt = createdAt;
    }

    @PrePersist
    void prePersist() {
        if (read == null) read = false;
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }
    public AlertType getType() { return type; }
    public void setType(AlertType type) { this.type = type; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
