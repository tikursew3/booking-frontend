package com.passion2code.booking.entity;

import com.passion2code.booking.enums.BookingType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "photography_service_id")
    private PhotographyService photographyService;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime; // calculated based on service duration

    private String location;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private String status;  // PENDING, CONFIRMED, COMPLETED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean reminderSent = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingType bookingType; // PHOTOGRAPHY or CONSULTATION
}
