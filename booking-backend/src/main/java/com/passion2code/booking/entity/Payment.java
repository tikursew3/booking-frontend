package com.passion2code.booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payments")
public class Payment {

    /*
        Field	        Type	    Description
        id	            Long	    Primary key
        bookingId	    Long	    Foreign key reference to the booking
        paymentAmount	BigDecimal	Amount paid (deposit or full)
        paymentStatus	String (Enum recommended)	PENDING, PAID, FAILED
        paymentMethod	String	e.g., Stripe, PayPal, Credit Card
        paymentReference    String	Transaction ID from Stripe or payment gateway
        createdAt	    LocalDateTime	Payment creation time
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Column(nullable = false)
    private String paymentStatus;  // PENDING, PAID, FAILED

    @Column(nullable = false)
    private String paymentMethod;  // Stripe, PayPal, Credit Card, etc.

    @Column(nullable = false)
    private String paymentReference; // Transaction ID from payment gateway

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
