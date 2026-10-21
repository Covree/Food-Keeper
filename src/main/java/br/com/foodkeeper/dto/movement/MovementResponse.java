package br.com.foodkeeper.dto.movement;

import br.com.foodkeeper.enums.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovementResponse(
        Long id,
        Long batchId,
        String productName,
        Long userId,
        String userName,
        MovementType type,
        BigDecimal quantity,
        String reason,
        LocalDateTime createdAt
) {}
