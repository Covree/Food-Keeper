package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.batch.*;
import br.com.foodkeeper.entity.Batch;
import br.com.foodkeeper.entity.Product;
import br.com.foodkeeper.exception.ResourceNotFoundException;
import br.com.foodkeeper.repository.BatchRepository;
import br.com.foodkeeper.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class BatchService {

    public BatchService(BatchRepository batchRepository, ProductRepository productRepository) {
        this.batchRepository = batchRepository;
        this.productRepository = productRepository;
    }

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public java.util.List<BatchResponse> findExpiring(int days) {
        LocalDate today = LocalDate.now();
        return batchRepository.findExpiringBatches(today, today.plusDays(days))
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BatchResponse findById(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote não encontrado."));
        return toResponse(batch);
    }

    @Transactional
    public BatchResponse create(BatchRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        Batch batch = new Batch();
        batch.setProduct(product);
        batch.setQuantity(request.quantity());
        batch.setExpirationDate(request.expirationDate());
        batch.setEntryDate(LocalDate.now());
        batch.setActive(true);

        return toResponse(batchRepository.save(batch));
    }

    @Transactional
    public BatchResponse update(Long id, BatchRequest request) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote não encontrado."));

        if (!batch.getProduct().getId().equals(request.productId())) {
            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
            batch.setProduct(product);
        }

        batch.setQuantity(request.quantity());
        batch.setExpirationDate(request.expirationDate());
        batch.setActive(request.quantity().signum() > 0);

        return toResponse(batch);
    }

    @Transactional
    public void delete(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote não encontrado."));
        batch.setActive(false);
        batch.setQuantity(java.math.BigDecimal.ZERO);
    }

    public BatchResponse toResponse(Batch b) {
        long days = ChronoUnit.DAYS.between(LocalDate.now(), b.getExpirationDate());
        String status = days <= 3 ? "URGENTE" : days <= 7 ? "ATENCAO" : "NORMAL";
        return new BatchResponse(
                b.getId(), b.getProduct().getId(), b.getProduct().getName(),
                b.getQuantity(), b.getExpirationDate(), b.getEntryDate(), days, status
        );
    }
}
