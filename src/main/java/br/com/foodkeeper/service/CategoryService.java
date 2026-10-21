package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.category.*;
import br.com.foodkeeper.entity.Category;
import br.com.foodkeeper.exception.BusinessException;
import br.com.foodkeeper.exception.ResourceNotFoundException;
import br.com.foodkeeper.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    private final CategoryRepository repository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return repository.findAllByOrderByNameAsc().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName()))
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (repository.existsByNameIgnoreCase(request.name().trim())) {
            throw new BusinessException("Já existe uma categoria com esse nome.");
        }

        Category category = new Category();
        category.setName(request.name().trim());
        category = repository.save(category);
        return new CategoryResponse(category.getId(), category.getName());
    }

    @Transactional
    public void delete(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
        if (!category.getProducts().isEmpty()) {
            throw new BusinessException("Não é possível excluir uma categoria vinculada a produtos.");
        }
        repository.delete(category);
    }
}
