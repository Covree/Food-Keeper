package br.com.foodkeeper.dto.dashboard;

import br.com.foodkeeper.dto.alert.AlertResponse;
import br.com.foodkeeper.dto.batch.BatchResponse;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalProducts,
        long activeBatches,
        BigDecimal totalStockItems,
        long urgentAlerts,
        long attentionAlerts,
        List<BatchResponse> expiringBatches,
        List<AlertResponse> alerts
) {}
