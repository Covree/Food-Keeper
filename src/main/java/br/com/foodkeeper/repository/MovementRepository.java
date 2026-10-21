package br.com.foodkeeper.repository;

import br.com.foodkeeper.entity.Movement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MovementRepository extends JpaRepository<Movement, Long> {

    @Query("""
           select m from Movement m
           join fetch m.batch b
           join fetch b.product
           join fetch m.user
           order by m.createdAt desc
           """)
    Page<Movement> findAllDetailed(Pageable pageable);
}
