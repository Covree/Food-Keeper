package br.com.foodkeeper.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Nome da categoria é obrigatório")
        @Size(max = 80, message = "Categoria deve ter no máximo 80 caracteres")
        String name
) {}
