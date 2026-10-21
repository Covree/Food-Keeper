package br.com.foodkeeper.controller;

import br.com.foodkeeper.dto.dashboard.DashboardResponse;
import br.com.foodkeeper.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard")
public class DashboardController {

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    private final DashboardService service;

    @GetMapping
    public DashboardResponse getDashboard() {
        return service.getDashboard();
    }
}
