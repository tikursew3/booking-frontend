package com.passion2code.booking.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.entity.Payment;
import com.passion2code.booking.enums.BookingType;
import com.passion2code.booking.repository.BookingRepository;
import com.passion2code.booking.repository.PaymentRepository;
import com.passion2code.booking.service.EmailService;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

@RestController
@RequestMapping("/api/stripe/webhook")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final ObjectMapper objectMapper;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService; // ✅ Inject EmailService


    @PostMapping
    public ResponseEntity<?> handleStripeWebhook(@RequestBody String payload) {
        try {
            JsonNode jsonNode = objectMapper.readTree(payload);
            String eventType = jsonNode.get("type").asText();

            if ("checkout.session.completed".equals(eventType)) {
                JsonNode session = jsonNode.get("data").get("object");

                String paymentIntentId = session.get("payment_intent").asText();
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
                String bookingIdStr = paymentIntent.getMetadata().get("bookingId");
                Long bookingId = Long.parseLong(bookingIdStr);

                BigDecimal amountTotal = BigDecimal.valueOf(session.get("amount_total").asLong())
                        .divide(BigDecimal.valueOf(100));

                // Save payment
                Payment payment = Payment.builder()
                        .bookingId(bookingId)
                        .paymentAmount(amountTotal)
                        .paymentStatus("PAID")
                        .paymentMethod("Stripe")
                        .paymentReference(session.get("id").asText())
                        .createdAt(LocalDateTime.now())
                        .build();
                paymentRepository.save(payment);

                // Update booking status and send confirmation email
                bookingRepository.findById(bookingId).ifPresentOrElse(booking -> {
                    booking.setStatus("CONFIRMED");
                    bookingRepository.save(booking);

                    // ✅ Send email confirmation
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter
                                .ofLocalizedDateTime(FormatStyle.FULL, FormatStyle.SHORT)
                                .withLocale(Locale.US);

                        String formattedDateTime = booking.getStartDateTime().format(formatter);

                        emailService.sendBookingConfirmation(
                                booking.getEmail(),
                                booking.getCustomerName(),
                                "Photography Session",
                                formattedDateTime
                        );

                        log.info("Confirmation email sent to {}", booking.getEmail());

                    } catch (Exception ex) {
                        log.error("Failed to send confirmation email", ex);
                    }

                    log.info("Booking status updated to CONFIRMED for booking ID: {}", bookingId);
                }, () -> log.warn("Booking ID {} not found when trying to update status.", bookingId));

                log.info("Payment confirmed for booking ID: {}", bookingId);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Webhook handling failed", e);
            return ResponseEntity.badRequest().body("Webhook error");
        }
    }
}
