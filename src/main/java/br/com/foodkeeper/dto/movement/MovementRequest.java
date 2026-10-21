package br.com.foodkeeper.dto.movement;

import br.com.foodkeeper.enums.MovementType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MovementRequest(
        @NotNull(message = "Lote é obrigatório")
        Long batchId,

        @NotNull(message = "Tipo de movimentação é obrigatório")
        MovementType type,

        @NotNull(message = "Quantidade é obrigatória")
        @DecimalMin(value = "0.001", message = "Quantidade deve ser maior que zero")
        BigDecimal quantity,

        @Size(max = 255, message = "Motivo deve ter no máximo 255 caracteres")
        String reason
) {}
