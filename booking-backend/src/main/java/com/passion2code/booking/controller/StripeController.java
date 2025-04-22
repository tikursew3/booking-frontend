package com.passion2code.booking.controller;

import com.passion2code.booking.repository.BookingRepository;
import com.passion2code.booking.service.StripeService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StripeController {
    /*
        This controller will expose an endpoint where:

        Your frontend sends the bookingId and amount (deposit or full amount).
        The backend responds with a Stripe checkout URL.
        The frontend then redirects the customer to that Stripe page.
     */
     @Value("${FRONTEND_BASE_URL:http://localhost:3000}")
    private String frontendBaseUrl;

    private final StripeService stripeService;
    private final BookingRepository bookingRepository;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestParam Long bookingId,
                                                   @RequestParam BigDecimal amount) {
        try {
            String successUrl = frontendBaseUrl + "/payment-success";// Frontend success page
            String cancelUrl = frontendBaseUrl + "/payment-cancel";// Frontend cancel page

            String sessionUrl = stripeService.createCheckoutSession(bookingId, amount);

            Map<String, String> response = new HashMap<>();
            response.put("checkoutUrl", sessionUrl);
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pay-later/{bookingId}")
    public ResponseEntity<?> createPayLaterCheckoutSession(@PathVariable Long bookingId) {
        return bookingRepository.findById(bookingId)
                .filter(b -> b.getStatus().equals("PENDING"))
                .map(booking -> {
                    try {
                        BigDecimal depositAmount = booking.getPhotographyService().getDepositAmount();
                        String sessionUrl = stripeService.createCheckoutSession(bookingId, depositAmount);
                        return ResponseEntity.ok().body(Map.of("checkoutUrl", sessionUrl));
                    } catch (StripeException e) {
                        return ResponseEntity.internalServerError().body("Failed to create Stripe session");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("Booking not found or not pending"));
    }

}
