package br.com.foodkeeper.controller;

import br.com.foodkeeper.dto.alert.AlertResponse;
import br.com.foodkeeper.service.AlertService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@Tag(name = "Alertas")
public class AlertController {

    public AlertController(AlertService service) {
        this.service = service;
    }

    private final AlertService service;

    @GetMapping
    public List<AlertResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/nao-lidos")
    public List<AlertResponse> findUnread() {
        return service.findUnread();
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @PostMapping("/gerar")
    public ResponseEntity<Void> generateNow() {
        service.generateExpirationAlerts();
        return ResponseEntity.noContent().build();
    }
}
