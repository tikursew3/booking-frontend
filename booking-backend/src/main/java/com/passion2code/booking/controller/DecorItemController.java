package com.passion2code.booking.controller;

import com.passion2code.booking.entity.DecorItem;
import com.passion2code.booking.service.DecorItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decor-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DecorItemController {

    private final DecorItemService decorItemService;

    @GetMapping
    public List<DecorItem> getAllDecorItems() {
        return decorItemService.getAllDecorItems();
    }

    @GetMapping("/active")
    public List<DecorItem> getActiveItems() {
        return decorItemService.getAllActiveDecorItems();
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        decorItemService.toggleActiveStatus(id, active);
        return ResponseEntity.ok().build();
    }

            /*
            @PatchMapping("/{id}/toggle-active")
        public ResponseEntity<?> toggleActive(@PathVariable Long id) {
            decorItemService.toggleActiveStatus(id);
            return ResponseEntity.ok().build();
        }

             */


    @GetMapping("/{id}")
    public ResponseEntity<DecorItem> getDecorItemById(@PathVariable Long id) {
        return decorItemService.getDecorItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DecorItem> createDecorItem(@RequestBody DecorItem decorItem) {
        return ResponseEntity.ok(decorItemService.createDecorItem(decorItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DecorItem> updateDecorItem(@PathVariable Long id, @RequestBody DecorItem decorItem) {
        return ResponseEntity.ok(decorItemService.updateDecorItem(id, decorItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDecorItem(@PathVariable Long id) {
        decorItemService.deleteDecorItem(id);
        return ResponseEntity.noContent().build();
    }
}
