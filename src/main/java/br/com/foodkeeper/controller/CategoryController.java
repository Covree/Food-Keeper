package br.com.foodkeeper.controller;

import br.com.foodkeeper.dto.category.*;
import br.com.foodkeeper.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorias")
public class CategoryController {

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    private final CategoryService service;

    @GetMapping
    public List<CategoryResponse> findAll() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
