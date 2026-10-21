package br.com.foodkeeper.dto.product;

import br.com.foodkeeper.enums.StorageSector;
import br.com.foodkeeper.enums.UnitOfMeasure;

import java.util.Set;

public record ProductResponse(
        Long id,
        String name,
        UnitOfMeasure unitOfMeasure,
        StorageSector storageSector,
        String barcode,
        Boolean active,
        Set<Long> categoryIds,
        Set<String> categoryNames
) {}
