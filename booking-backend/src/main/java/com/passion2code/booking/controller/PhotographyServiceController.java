package com.passion2code.booking.controller;

import com.passion2code.booking.entity.PhotographyService;
import com.passion2code.booking.service.PhotographyServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/photography-services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows calls from frontend
public class PhotographyServiceController {

    private final PhotographyServiceService photographyServiceService;

    @GetMapping
    public List<PhotographyService> getAllServices() {
        return photographyServiceService.getAllServices();
    }

    @GetMapping("/active")
    public List<PhotographyService> getActiveServices() {
        return photographyServiceService.getAllActiveServices();
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActiveStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        photographyServiceService.toggleActiveStatus(id, active);
        return ResponseEntity.ok().build();
    }



    @GetMapping("/{id}")
    public ResponseEntity<PhotographyService> getServiceById(@PathVariable Long id) {
        return photographyServiceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PhotographyService> createService(@RequestBody PhotographyService service) {
        return ResponseEntity.ok(photographyServiceService.createService(service));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotographyService> updateService(@PathVariable Long id, @RequestBody PhotographyService service) {
        return ResponseEntity.ok(photographyServiceService.updateService(id, service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        photographyServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}

/*
Method	Endpoint	Purpose
GET	/api/photography-services	Get all services
GET	/api/photography-services/{id}	Get service by ID
POST	/api/photography-services	Create new service
PUT	/api/photography-services/{id}	Update existing service
DELETE	/api/photography-services/{id}	Delete a service
 */
