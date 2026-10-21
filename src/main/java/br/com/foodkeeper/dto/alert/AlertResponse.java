package br.com.foodkeeper.dto.alert;

import br.com.foodkeeper.enums.AlertType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AlertResponse(
        Long id,
        Long batchId,
        Long productId,
        String productName,
        LocalDate expirationDate,
        AlertType type,
        String message,
        Boolean read,
        LocalDateTime createdAt
) {}
