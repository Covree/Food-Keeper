package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.dashboard.DashboardResponse;
import br.com.foodkeeper.repository.*;
import br.com.foodkeeper.enums.AlertType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    public DashboardService(ProductRepository productRepository, BatchRepository batchRepository, AlertRepository alertRepository, BatchService batchService, AlertService alertService) {
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.alertRepository = alertRepository;
        this.batchService = batchService;
        this.alertService = alertService;
    }

    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final AlertRepository alertRepository;
    private final BatchService batchService;
    private final AlertService alertService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        var expiring = batchService.findExpiring(7);
        var alerts = alertService.findUnread();

        return new DashboardResponse(
                productRepository.countActiveProducts(),
                batchRepository.countActiveBatches(),
                batchRepository.sumActiveStock(),
                alertRepository.countUnreadByType(AlertType.URGENTE),
                alertRepository.countUnreadByType(AlertType.ATENCAO),
                expiring,
                alerts
        );
    }
}
