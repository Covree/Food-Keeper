package br.com.foodkeeper.repository;

import br.com.foodkeeper.entity.User;
import br.com.foodkeeper.enums.Role;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
	Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String busca, String busca2,
			Pageable pageable);
	int countByRole(Role admin);
}
