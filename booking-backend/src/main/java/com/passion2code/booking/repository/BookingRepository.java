package com.passion2code.booking.repository;

import com.passion2code.booking.dto.ServiceBookingCountDTO;
import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.enums.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Check for overlapping bookings for a given time slot
    @Query("""
    SELECT b FROM Booking b 
    WHERE (:serviceId IS NULL OR b.photographyService.id = :serviceId)
      AND (b.status = 'PENDING' OR b.status = 'CONFIRMED')
      AND b.startDateTime < :requestedEnd 
      AND b.endDateTime > :requestedStart
""")
    List<Booking> findOverlappingBookings(@Param("serviceId") Long serviceId,
                                          @Param("requestedStart") LocalDateTime requestedStart,
                                          @Param("requestedEnd") LocalDateTime requestedEnd);



    /*
this custom query:
It finds bookings for the same service where:
Status is PENDING or CONFIRMED
The requested start or end time overlaps with an existing booking time window
This will help us prevent double-booking.
 */

    @Transactional
    @Modifying
    @Query("UPDATE Booking b SET b.status = 'CANCELLED' WHERE b.status = 'PENDING' AND b.createdAt < :expireBefore")
    int expirePendingBookings(LocalDateTime expireBefore);


    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.reminderSent = false AND b.createdAt < :cutoff")
    List<Booking> findPendingBookingsWithoutReminder(LocalDateTime cutoff);

    @Query("""
    SELECT b FROM Booking b 
    WHERE b.status = 'CONFIRMED' 
      AND b.reminderSent = false 
      AND b.startDateTime BETWEEN :start AND :end
""")
    List<Booking> findUpcomingConfirmedBookings(LocalDateTime start, LocalDateTime end);


    long countByStatus(String status);
    long countByBookingType(BookingType bookingType);

    @Query("SELECT new com.passion2code.booking.dto.ServiceBookingCountDTO(" +
            "COALESCE(b.photographyService.name, 'Consultation'), COUNT(b)) " +
            "FROM Booking b GROUP BY b.photographyService.name")
    List<ServiceBookingCountDTO> countBookingsByService();

}