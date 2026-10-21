package br.com.foodkeeper.dto.auth;

public record AuthResponse(
        String token,
        String type,
        Long userId,
        String name,
        String email,
        String role
) {}
