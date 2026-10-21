package br.com.foodkeeper.controller;

import br.com.foodkeeper.dto.movement.*;
import br.com.foodkeeper.service.MovementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movimentacoes")
@Tag(name = "Movimentações de Estoque")
public class MovementController {

    public MovementController(MovementService service) {
        this.service = service;
    }

    private final MovementService service;

    @PostMapping
    public ResponseEntity<MovementResponse> create(
            @Valid @RequestBody MovementRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication));
    }

    @PostMapping("/entrada")
    public ResponseEntity<MovementResponse> entry(
            @RequestBody @Valid MovementRequest request,
            Authentication authentication
    ) {
        if (request.type() != br.com.foodkeeper.enums.MovementType.ENTRADA) {
            throw new IllegalArgumentException("O endpoint /entrada exige type=ENTRADA.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication));
    }

    @PostMapping("/saida")
    public ResponseEntity<MovementResponse> exit(
            @RequestBody @Valid MovementRequest request,
            Authentication authentication
    ) {
        if (request.type() != br.com.foodkeeper.enums.MovementType.SAIDA) {
            throw new IllegalArgumentException("O endpoint /saida exige type=SAIDA.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication));
    }

    @PostMapping("/perda")
    public ResponseEntity<MovementResponse> loss(
            @RequestBody @Valid MovementRequest request,
            Authentication authentication
    ) {
        if (request.type() != br.com.foodkeeper.enums.MovementType.PERDA) {
            throw new IllegalArgumentException("O endpoint /perda exige type=PERDA.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication));
    }

    @GetMapping
    public Page<MovementResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Parâmetros de paginação inválidos.");
        }
        return service.findAll(page, size);
    }
}
