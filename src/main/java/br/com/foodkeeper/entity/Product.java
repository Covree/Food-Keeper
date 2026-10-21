package br.com.foodkeeper.entity;

import br.com.foodkeeper.enums.StorageSector;
import br.com.foodkeeper.enums.UnitOfMeasure;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_name", columnList = "name")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UnitOfMeasure unitOfMeasure;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StorageSector storageSector;

    @Column(length = 80)
    private String barcode;

    @Column(nullable = false)
    private Boolean active;

    @ManyToMany
    @JoinTable(
            name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Batch> batches = new HashSet<>();

    public Product() {}

    public Product(Long id, String name, UnitOfMeasure unitOfMeasure, StorageSector storageSector, String barcode,
                   Boolean active, Set<Category> categories, Set<Batch> batches) {
        this.id = id; this.name = name; this.unitOfMeasure = unitOfMeasure; this.storageSector = storageSector;
        this.barcode = barcode; this.active = active; this.categories = categories; this.batches = batches;
    }

    @PrePersist
    void prePersist() {
        if (active == null) active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UnitOfMeasure getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(UnitOfMeasure unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }
    public StorageSector getStorageSector() { return storageSector; }
    public void setStorageSector(StorageSector storageSector) { this.storageSector = storageSector; }
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Set<Category> getCategories() { return categories; }
    public void setCategories(Set<Category> categories) { this.categories = categories; }
    public Set<Batch> getBatches() { return batches; }
    public void setBatches(Set<Batch> batches) { this.batches = batches; }
}
