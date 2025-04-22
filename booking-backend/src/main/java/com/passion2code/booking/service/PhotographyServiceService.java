package com.passion2code.booking.service;

import com.passion2code.booking.entity.PhotographyService;
import com.passion2code.booking.repository.PhotographyServiceRepository;
import lombok.Data;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Data
@RequiredArgsConstructor
public class PhotographyServiceService {

    private final PhotographyServiceRepository photographyServiceRepository;

    public List<PhotographyService> getAllServices() {
        return photographyServiceRepository.findAll();
    }

    public List<PhotographyService> getAllActiveServices() {
        return photographyServiceRepository.findByActiveTrue();
    }

    public Optional<PhotographyService> getServiceById(Long id) {
        return photographyServiceRepository.findById(id);
    }

    public PhotographyService createService(PhotographyService service) {
        return photographyServiceRepository.save(service);
    }

    public void toggleActiveStatus(Long id, boolean active) {
        PhotographyService service = photographyServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setActive(active);
        photographyServiceRepository.save(service);
    }


    public PhotographyService updateService(Long id, PhotographyService updatedService) {
        return photographyServiceRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedService.getName());
                    existing.setDescription(updatedService.getDescription());
                    existing.setPrice(updatedService.getPrice());
                    existing.setDepositAmount(updatedService.getDepositAmount());
                    existing.setDuration(updatedService.getDuration());
                    existing.setImageUrl(updatedService.getImageUrl());
                    return photographyServiceRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void deleteService(Long id) {
        photographyServiceRepository.deleteById(id);
    }
}
