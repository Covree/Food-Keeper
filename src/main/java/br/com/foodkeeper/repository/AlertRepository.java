package br.com.foodkeeper.repository;

import br.com.foodkeeper.entity.Alert;
import br.com.foodkeeper.enums.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findTop50ByOrderByCreatedAtDesc();

    List<Alert> findByReadFalseOrderByCreatedAtDesc();

    Optional<Alert> findByBatchIdAndType(Long batchId, AlertType type);

    @Query("select count(a) from Alert a where a.read = false and a.type = :type")
    long countUnreadByType(AlertType type);
}
