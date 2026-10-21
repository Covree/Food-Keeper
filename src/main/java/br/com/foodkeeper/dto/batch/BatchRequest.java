package br.com.foodkeeper.dto.batch;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BatchRequest(
        @NotNull(message = "Produto é obrigatório")
        Long productId,

        @NotNull(message = "Quantidade é obrigatória")
        @DecimalMin(value = "0.001", message = "Quantidade deve ser maior que zero")
        BigDecimal quantity,

        @NotNull(message = "Data de validade é obrigatória")
        @FutureOrPresent(message = "A data de validade não pode ser anterior à data atual")
        LocalDate expirationDate
) {}
