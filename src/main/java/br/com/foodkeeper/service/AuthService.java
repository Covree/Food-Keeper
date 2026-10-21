package br.com.foodkeeper.service;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.foodkeeper.dto.auth.AuthResponse;
import br.com.foodkeeper.dto.auth.LoginRequest;
import br.com.foodkeeper.dto.auth.RegisterRequest;
import br.com.foodkeeper.entity.User;
import br.com.foodkeeper.enums.Role;
import br.com.foodkeeper.repository.UserRepository;
import br.com.foodkeeper.security.JwtService;

@Service
public class AuthService {

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Já existe um usuário com este e-mail.");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.FUNCIONARIO);
        user.setActive(true);

        userRepository.save(user);
        // Pronto! Não gera token aqui.
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o e-mail: " + email));
    }
        
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim().toLowerCase(),
                        request.password()
                )
        );

        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas."));

        return authenticateUser(user);
    }

    private AuthResponse authenticateUser(User user) {
        UserDetails details = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = jwtService.generateToken(details, Map.of(
                "role", user.getRole().name(),
                "name", user.getName()
        ));

        return new AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
