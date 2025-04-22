package com.passion2code.booking.controller;

import com.passion2code.booking.dto.ContactMessageDTO;
import com.passion2code.booking.entity.ContactMessage;
import com.passion2code.booking.repository.ContactMessageRepository;
import com.passion2code.booking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactUsController {

    private final EmailService emailService;
    private final ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<String> handleContactForm(@RequestBody ContactMessageDTO messageDTO) {
        try {
            // Save message to database
            ContactMessage message = ContactMessage.builder()
                    .name(messageDTO.getName())
                    .email(messageDTO.getEmail())
                    .subject(messageDTO.getSubject())
                    .message(messageDTO.getMessage())
                    .createdAt(LocalDateTime.now())
                    .build();
            contactMessageRepository.save(message);

            // Send email
            emailService.sendContactMessage(
                    messageDTO.getEmail(),
                    messageDTO.getName(),
                    messageDTO.getSubject(),
                    messageDTO.getMessage()
            );

            return ResponseEntity.ok("Message sent and saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send/save message: " + e.getMessage());
        }
    }
}
