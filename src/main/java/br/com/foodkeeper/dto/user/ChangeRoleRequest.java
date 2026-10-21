package br.com.foodkeeper.dto.user;

import br.com.foodkeeper.enums.Role;
import jakarta.validation.constraints.NotNull;

public record ChangeRoleRequest(@NotNull Role role) {}