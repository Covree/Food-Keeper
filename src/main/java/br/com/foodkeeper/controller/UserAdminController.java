package br.com.foodkeeper.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.foodkeeper.dto.user.ChangeRoleRequest;
import br.com.foodkeeper.dto.user.UserAdminResponse;
import br.com.foodkeeper.service.UserAdminService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserAdminService service;

    public UserAdminController(UserAdminService service) {
        this.service = service;
    }

    @GetMapping
    public Page<UserAdminResponse> listar(Pageable pageable,
                                          @RequestParam(required = false) String busca) {
        return service.listar(busca, pageable);
    }

    @PatchMapping("/{id}/role")
    public UserAdminResponse alterarRole(@PathVariable Long id,
                                         @RequestBody @Valid ChangeRoleRequest req,
                                         Authentication auth) {
        return service.alterarRole(id, req.role(), auth.getName());
    }

    @PatchMapping("/{id}/status")
    public UserAdminResponse alternarStatus(@PathVariable Long id, Authentication auth) {
        return service.alternarStatus(id, auth.getName());
    }
}