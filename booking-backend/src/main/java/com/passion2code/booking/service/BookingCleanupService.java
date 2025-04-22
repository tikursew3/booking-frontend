package com.passion2code.booking.service;

import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupService {

    private final BookingRepository bookingRepository;
    // Runs every hour (adjust if needed)
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void expirePendingBookings() {
        LocalDateTime expireBefore = LocalDateTime.now().minusHours(24); // Bookings older than 24 hours
        int affectedRows = bookingRepository.expirePendingBookings(expireBefore);
        if (affectedRows > 0) {
            log.info("Expired {} pending bookings older than {}", affectedRows, expireBefore);
        }

    }
}
