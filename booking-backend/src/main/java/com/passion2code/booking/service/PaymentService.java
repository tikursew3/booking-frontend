package com.passion2code.booking.service;

import com.passion2code.booking.entity.Payment;
import com.passion2code.booking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment createPayment(Payment paymentRequest) {
        paymentRequest.setCreatedAt(LocalDateTime.now());
        return paymentRepository.save(paymentRequest);
    }

    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment updatePaymentStatus(Long paymentId, String newStatus) {
        return paymentRepository.findById(paymentId)
                .map(payment -> {
                    payment.setPaymentStatus(newStatus);
                    return paymentRepository.save(payment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
