package com.passion2code.booking.service;

import com.passion2code.booking.entity.DecorItem;
import com.passion2code.booking.repository.DecorItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DecorItemService {

    private final DecorItemRepository decorItemRepository;

    public List<DecorItem> getAllDecorItems() {
        return decorItemRepository.findAll();
    }

    public List<DecorItem> getAllActiveDecorItems() {
        return decorItemRepository.findByActiveTrue();
    }
    public void toggleActiveStatus(Long id, boolean active) {
        DecorItem item = decorItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decor item not found"));
        item.setActive(active);
        decorItemRepository.save(item);
    }


    public Optional<DecorItem> getDecorItemById(Long id) {
        return decorItemRepository.findById(id);
    }

    public DecorItem createDecorItem(DecorItem decorItem) {
        return decorItemRepository.save(decorItem);
    }

    public DecorItem updateDecorItem(Long id, DecorItem updatedItem) {
        DecorItem existing = decorItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decor item not found"));
        existing.setName(updatedItem.getName());
        existing.setDescription(updatedItem.getDescription());
        existing.setPricePerDay(updatedItem.getPricePerDay());
        existing.setImageUrl(updatedItem.getImageUrl());
        existing.setImages(updatedItem.getImages());
        return decorItemRepository.save(existing);
    }

    public void deleteDecorItem(Long id) {
        decorItemRepository.deleteById(id);
    }
}
