package br.com.foodkeeper.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.foodkeeper.dto.user.UserAdminResponse;
import br.com.foodkeeper.entity.User;
import br.com.foodkeeper.enums.Role;
import br.com.foodkeeper.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserAdminService {

    private final UserRepository repo;

    public UserAdminService(UserRepository repo) {
        this.repo = repo;
    }

    public Page<UserAdminResponse> listar(String busca, Pageable pageable) {
        Page<User> page = (busca == null || busca.isBlank())
                ? repo.findAll(pageable)
                : repo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(busca, busca, pageable);
        return page.map(this::toResponse);
    }

    @Transactional
    public UserAdminResponse alterarRole(Long id, Role novoRole, String emailLogado) {
        User alvo = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // não deixa o admin se rebaixar sozinho
        if (alvo.getEmail().equals(emailLogado) && novoRole != Role.ADMIN) {
            throw new IllegalStateException("Você não pode remover seu próprio acesso de admin");
        }

        // não deixa o sistema ficar sem nenhum admin
        if (alvo.getRole() == Role.ADMIN && novoRole != Role.ADMIN
                && repo.countByRole(Role.ADMIN) <= 1) {
            throw new IllegalStateException("Deve existir pelo menos um administrador");
        }

        alvo.setRole(novoRole);
        return toResponse(repo.save(alvo));
    }

    private UserAdminResponse toResponse(User u) {
        return new UserAdminResponse(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}