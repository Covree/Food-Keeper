package br.com.foodkeeper.service;

import br.com.foodkeeper.dto.movement.*;
import br.com.foodkeeper.entity.*;
import br.com.foodkeeper.enums.MovementType;
import br.com.foodkeeper.exception.BusinessException;
import br.com.foodkeeper.exception.ResourceNotFoundException;
import br.com.foodkeeper.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class MovementService {

    public MovementService(MovementRepository movementRepository, BatchRepository batchRepository, UserRepository userRepository) {
        this.movementRepository = movementRepository;
        this.batchRepository = batchRepository;
        this.userRepository = userRepository;
    }

    private final MovementRepository movementRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;

    @Transactional
    public MovementResponse create(MovementRequest request, Authentication authentication) {
        Batch batch = batchRepository.findByIdForUpdate(request.batchId())
                .orElseThrow(() -> new ResourceNotFoundException("Lote não encontrado."));

        User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado."));

        BigDecimal quantity = request.quantity();

        if (request.type() == MovementType.ENTRADA) {
            batch.setQuantity(batch.getQuantity().add(quantity));
            batch.setActive(true);
        } else {
            if (batch.getQuantity().compareTo(quantity) < 0) {
                throw new BusinessException("Quantidade insuficiente no lote para realizar a baixa.");
            }
            batch.setQuantity(batch.getQuantity().subtract(quantity));
            if (batch.getQuantity().signum() == 0) {
                batch.setActive(false);
            }
        }

        Movement movement = new Movement();
        movement.setBatch(batch);
        movement.setUser(user);
        movement.setType(request.type());
        movement.setQuantity(quantity);
        movement.setReason(request.reason());

        return toResponse(movementRepository.save(movement));
    }

    @Transactional(readOnly = true)
    public Page<MovementResponse> findAll(int page, int size) {
        return movementRepository.findAllDetailed(
                        PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    private MovementResponse toResponse(Movement m) {
        return new MovementResponse(
                m.getId(),
                m.getBatch().getId(),
                m.getBatch().getProduct().getName(),
                m.getUser().getId(),
                m.getUser().getName(),
                m.getType(),
                m.getQuantity(),
                m.getReason(),
                m.getCreatedAt()
        );
    }
}
