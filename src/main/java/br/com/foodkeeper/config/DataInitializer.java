package br.com.foodkeeper.config;

import br.com.foodkeeper.entity.Category;
import br.com.foodkeeper.entity.User;
import br.com.foodkeeper.enums.Role;
import br.com.foodkeeper.repository.CategoryRepository;
import br.com.foodkeeper.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${foodkeeper.seed-admin.enabled:false}")
    private boolean enabled;

    @Value("${foodkeeper.seed-admin.name:Administrador}")
    private String adminName;

    @Value("${foodkeeper.seed-admin.email:admin@foodkeeper.local}")
    private String adminEmail;

    @Value("${foodkeeper.seed-admin.password:}")
    private String adminPassword;

    @Bean
    CommandLineRunner initializeData() {
        return args -> {
            seedCategories();
            if (enabled && !adminPassword.isBlank() && !userRepository.existsByEmailIgnoreCase(adminEmail)) {
                User admin = new User();
                admin.setName(adminName);
                admin.setEmail(adminEmail.toLowerCase());
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
            }
        };
    }

    private void seedCategories() {
        String[] defaults = {"Carnes", "Laticínios", "Hortifruti", "Bebidas", "Secos", "Congelados"};
        for (String name : defaults) {
            if (!categoryRepository.existsByNameIgnoreCase(name)) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }
    }
}
