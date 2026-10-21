package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.alert.AlertResponse;
import br.com.foodkeeper.entity.Alert;
import br.com.foodkeeper.entity.Batch;
import br.com.foodkeeper.enums.AlertType;
import br.com.foodkeeper.repository.AlertRepository;
import br.com.foodkeeper.repository.BatchRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AlertService {

    public AlertService(AlertRepository alertRepository, BatchRepository batchRepository) {
        this.alertRepository = alertRepository;
        this.batchRepository = batchRepository;
    }

    private final AlertRepository alertRepository;
    private final BatchRepository batchRepository;

    @Scheduled(cron = "${foodkeeper.alerts.cron:0 0 * * * *}")
    @Transactional
    public void generateExpirationAlerts() {
        LocalDate today = LocalDate.now();

        List<Batch> batches = batchRepository.findExpiringBatches(today, today.plusDays(7));

        for (Batch batch : batches) {
            long days = ChronoUnit.DAYS.between(today, batch.getExpirationDate());
            AlertType type = days <= 3 ? AlertType.URGENTE : days <= 5 ? AlertType.ATENCAO : AlertType.AVISO;

            Alert alert = alertRepository.findByBatchIdAndType(batch.getId(), type)
                    .orElseGet(() -> {
                        Alert newAlert = new Alert();
                        newAlert.setBatch(batch);
                        newAlert.setType(type);
                        newAlert.setRead(false);
                        return newAlert;
                    });

            alert.setMessage(buildMessage(batch, days));
            alert.setRead(false);
            alertRepository.save(alert);
        }
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> findAll() {
        return alertRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> findUnread() {
        return alertRepository.findByReadFalseOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void markAsRead(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new br.com.foodkeeper.exception.ResourceNotFoundException("Alerta não encontrado."));
        alert.setRead(true);
    }

    private String buildMessage(Batch batch, long days) {
        String suffix = days == 0 ? "vence hoje" : days == 1 ? "vence amanhã" : "vence em " + days + " dias";
        return "O lote de " + batch.getProduct().getName() + " " + suffix + ".";
    }

    private AlertResponse toResponse(Alert a) {
        return new AlertResponse(
                a.getId(),
                a.getBatch().getId(),
                a.getBatch().getProduct().getId(),
                a.getBatch().getProduct().getName(),
                a.getBatch().getExpirationDate(),
                a.getType(),
                a.getMessage(),
                a.getRead(),
                a.getCreatedAt()
        );
    }
}
