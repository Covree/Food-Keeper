package br.com.foodkeeper.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.foodkeeper.dto.user.ChangeRoleRequest;
import br.com.foodkeeper.dto.user.UserAdminResponse;
import br.com.foodkeeper.service.UserAdminService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/usuarios")
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

    @PatchMapping("/{id}/cargo")
    public UserAdminResponse alterarRole(@PathVariable Long id,
                                         @RequestBody @Valid ChangeRoleRequest req,
                                         Authentication auth) {
        return service.alterarRole(id, req.role(), auth.getName());
    }
}