package br.com.foodkeeper.dto.user;

import br.com.foodkeeper.enums.Role;

public record UserAdminResponse(Long id, String name, String email, Role role) {}