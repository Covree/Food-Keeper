package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.product.*;
import br.com.foodkeeper.entity.Category;
import br.com.foodkeeper.entity.Product;
import br.com.foodkeeper.exception.BusinessException;
import br.com.foodkeeper.exception.ResourceNotFoundException;
import br.com.foodkeeper.repository.CategoryRepository;
import br.com.foodkeeper.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class ProductService {

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Product> products = (name == null || name.isBlank())
                ? productRepository.findByActiveTrue(pageable) // Altere de findAll(pageable) para findByActiveTrue(pageable)
                : productRepository.findByActiveTrueAndNameContainingIgnoreCase(name.trim(), pageable);

        return products.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        Product product = productRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (request.barcode() != null && !request.barcode().isBlank()
                && productRepository.findByBarcodeAndActiveTrue(request.barcode().trim()).isPresent()) {
            throw new BusinessException("Já existe um produto ativo com este código de barras.");
        }

        Product product = new Product();
        product.setName(request.name().trim());
        product.setUnitOfMeasure(request.unitOfMeasure());
        product.setStorageSector(request.storageSector());
        product.setBarcode(blankToNull(request.barcode()));
        product.setActive(true);
        product.setCategories(loadCategories(request.categoryIds()));

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        if (request.barcode() != null && !request.barcode().isBlank()) {
            productRepository.findByBarcodeAndActiveTrue(request.barcode().trim())
                    .filter(found -> !found.getId().equals(id))
                    .ifPresent(found -> {
                        throw new BusinessException("Já existe outro produto ativo com este código de barras.");
                    });
        }

        product.setName(request.name().trim());
        product.setUnitOfMeasure(request.unitOfMeasure());
        product.setStorageSector(request.storageSector());
        product.setBarcode(blankToNull(request.barcode()));
        product.setCategories(loadCategories(request.categoryIds()));

        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
        product.setActive(false);
    }

    private Set<Category> loadCategories(Set<Long> ids) {
        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(ids));
        if (categories.size() != ids.size()) {
            throw new BusinessException("Uma ou mais categorias informadas não existem.");
        }
        return categories;
    }

    private ProductResponse toResponse(Product p) {
        Set<Long> ids = p.getCategories().stream().map(Category::getId).collect(java.util.stream.Collectors.toSet());
        Set<String> names = p.getCategories().stream().map(Category::getName).collect(java.util.stream.Collectors.toSet());
        return new ProductResponse(
                p.getId(), p.getName(), p.getUnitOfMeasure(), p.getStorageSector(),
                p.getBarcode(), p.getActive(), ids, names
        );
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
