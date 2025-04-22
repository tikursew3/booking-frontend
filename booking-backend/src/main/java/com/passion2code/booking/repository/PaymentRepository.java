package com.passion2code.booking.repository;

import org.springframework.data.jpa.repository.Query;
import com.passion2code.booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /*
        This repository will allow:

        Basic CRUD operations
        Fetching all payments related to a specific booking (useful for history or audit
     */
    List<Payment> findByBookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(p.paymentAmount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    double sumAllPaidAmount();

}

