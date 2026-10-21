package br.com.foodkeeper.repository;

import br.com.foodkeeper.entity.Batch;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Batch b join fetch b.product where b.id = :id")
    Optional<Batch> findByIdForUpdate(@Param("id") Long id);

    @Query("""
           select b from Batch b
           join fetch b.product p
           where b.active = true
             and b.quantity > 0
             and b.expirationDate between :today and :limitDate
           order by b.expirationDate asc
           """)
    List<Batch> findExpiringBatches(
            @Param("today") LocalDate today,
            @Param("limitDate") LocalDate limitDate
    );

    @Query("select count(b) from Batch b where b.active = true and b.quantity > 0")
    long countActiveBatches();

    @Query("select coalesce(sum(b.quantity), 0) from Batch b where b.active = true and b.quantity > 0")
    java.math.BigDecimal sumActiveStock();
}
