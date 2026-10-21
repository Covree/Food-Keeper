package br.com.foodkeeper.repository;

import br.com.foodkeeper.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    Optional<Product> findByBarcodeAndActiveTrue(String barcode);

    @Query("select count(p) from Product p where p.active = true")
    long countActiveProducts();

    @Query("""
           select distinct p from Product p
           left join fetch p.categories
           where p.id = :id
           """)
    Optional<Product> findDetailedById(@Param("id") Long id);
    
    Page<Product> findByActiveTrue(Pageable pageable);
}
