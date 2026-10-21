package br.com.foodkeeper.controller;

import br.com.foodkeeper.dto.batch.*;
import br.com.foodkeeper.service.BatchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@Tag(name = "Lotes / Validade")
public class BatchController {

    public BatchController(BatchService service) {
        this.service = service;
    }

    private final BatchService service;

    @GetMapping("/{id}")
    public BatchResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/vencendo")
    public List<BatchResponse> expiring(@RequestParam(defaultValue = "7") int dias) {
        if (dias < 0 || dias > 365) {
            throw new IllegalArgumentException("O parâmetro dias deve estar entre 0 e 365.");
        }
        return service.findExpiring(dias);
    }

    @PostMapping
    public ResponseEntity<BatchResponse> create(@Valid @RequestBody BatchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public BatchResponse update(@PathVariable Long id, @Valid @RequestBody BatchRequest request) {
        return service.update(id, request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
