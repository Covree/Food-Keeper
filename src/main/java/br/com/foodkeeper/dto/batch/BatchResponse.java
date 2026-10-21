package br.com.foodkeeper.dto.batch;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BatchResponse(
        Long id,
        Long productId,
        String productName,
        BigDecimal quantity,
        LocalDate expirationDate,
        LocalDate entryDate,
        long daysToExpire,
        String status
) {}
