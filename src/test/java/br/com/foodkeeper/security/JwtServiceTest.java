package br.com.foodkeeper.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService service = new JwtService(
                "test-secret-which-is-long-enough-for-hmac-sha-key-123456",
                3_600_000
        );

        var user = User.withUsername("user@test.com")
                .password("password")
                .roles("FUNCIONARIO")
                .build();

        String token = service.generateToken(user, Map.of("role", "FUNCIONARIO"));

        assertNotNull(token);
        assertEquals("user@test.com", service.extractUsername(token));
        assertTrue(service.isTokenValid(token, user));
    }
}
