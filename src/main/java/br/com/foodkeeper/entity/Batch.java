package br.com.foodkeeper.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "batches", indexes = {
        @Index(name = "idx_batches_expiration", columnList = "expiration_date"),
        @Index(name = "idx_batches_product", columnList = "product_id")
})
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(nullable = false)
    private LocalDate expirationDate;

    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(nullable = false)
    private Boolean active;

    public Batch() {}

    public Batch(Long id, Product product, BigDecimal quantity, LocalDate expirationDate, LocalDate entryDate, Boolean active) {
        this.id = id; this.product = product; this.quantity = quantity; this.expirationDate = expirationDate;
        this.entryDate = entryDate; this.active = active;
    }

    @PrePersist
    void prePersist() {
        if (entryDate == null) entryDate = LocalDate.now();
        if (active == null) active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
    public LocalDate getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
