package br.com.foodkeeper.dto.product;

import br.com.foodkeeper.enums.StorageSector;
import br.com.foodkeeper.enums.UnitOfMeasure;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record ProductRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 120, message = "Nome deve ter no máximo 120 caracteres")
        String name,

        @NotNull(message = "Unidade de medida é obrigatória")
        UnitOfMeasure unitOfMeasure,

        @NotNull(message = "Setor de armazenamento é obrigatório")
        StorageSector storageSector,

        @Size(max = 80, message = "Código de barras deve ter no máximo 80 caracteres")
        String barcode,

        @NotEmpty(message = "Informe pelo menos uma categoria")
        Set<Long> categoryIds
) {}
