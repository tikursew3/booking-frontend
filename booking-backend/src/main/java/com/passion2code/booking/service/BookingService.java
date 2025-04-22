package com.passion2code.booking.service;

import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

import com.passion2code.booking.dto.BookingCalendarEventDTO;
import com.passion2code.booking.dto.BookingRequestDTO;
import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.entity.PhotographyService;
import com.passion2code.booking.enums.BookingType;
import com.passion2code.booking.repository.BookingRepository;
import com.passion2code.booking.repository.PhotographyServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PhotographyServiceRepository photographyServiceRepository;
    private final EmailService emailService; // ✅ Inject the EmailService

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(BookingRequestDTO bookingRequest) {
        BookingType bookingType = bookingRequest.getBookingType();
        LocalDateTime startDateTime = bookingRequest.getStartDateTime();
        LocalDateTime endDateTime;

        Booking booking = new Booking();
        booking.setCustomerName(bookingRequest.getCustomerName());
        booking.setEmail(bookingRequest.getEmail());
        booking.setPhoneNumber(bookingRequest.getPhoneNumber());
        booking.setLocation(bookingRequest.getLocation());
        booking.setNotes(bookingRequest.getNotes());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus("PENDING");
        booking.setBookingType(bookingType);

        if (bookingType == BookingType.PHOTOGRAPHY) {
            PhotographyService service = photographyServiceRepository
                    .findById(bookingRequest.getPhotographyServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found"));

            Duration duration = parseDuration(service.getDuration());
            endDateTime = startDateTime.plus(duration);
            booking.setPhotographyService(service);

        } else if (bookingType == BookingType.CONSULTATION) {
            endDateTime = startDateTime.plusMinutes(30);
            booking.setPhotographyService(null);
        } else {
            throw new RuntimeException("Unsupported booking type: " + bookingType);
        }

        // Slot validation for both types
        Long serviceId = (bookingType == BookingType.PHOTOGRAPHY)
                ? bookingRequest.getPhotographyServiceId()
                : null;

        boolean slotAvailable = bookingRepository.findOverlappingBookings(
                serviceId, startDateTime, endDateTime
        ).isEmpty();

        if (!slotAvailable) {
            throw new RuntimeException("Selected time slot is not available");
        }

        booking.setStartDateTime(startDateTime);
        booking.setEndDateTime(endDateTime);

        Booking savedBooking = bookingRepository.save(booking);

        // ✅ Send confirmation email for consultations only
        if (bookingType == BookingType.CONSULTATION) {

            DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL,
                            FormatStyle.SHORT)
                    .withLocale(Locale.US);

            String formattedDateTime = savedBooking.getStartDateTime().format(formatter);

            emailService.sendBookingConfirmation(
                    savedBooking.getEmail(),
                    savedBooking.getCustomerName(),
                    "Consultation",
                    formattedDateTime
            );
        }

        return savedBooking;
    }

    public List<BookingCalendarEventDTO> getCalendarEvents() {
        return bookingRepository.findAll().stream().map(booking -> {
            String title = (booking.getBookingType().name().equals("CONSULTATION") ? "💬 " : "📷 ")
                    + booking.getBookingType().name() + " - " + booking.getCustomerName();

            return new BookingCalendarEventDTO(
                    title,
                    booking.getStartDateTime(),
                    booking.getEndDateTime(),
                    booking.getStatus(),
                    booking.getBookingType().name()
            );
        }).toList();
    }


    private Duration parseDuration(String durationText) {
        String lower = durationText.toLowerCase().trim();
        if (lower.contains("hour")) {
            int hours = Integer.parseInt(lower.split(" ")[0]);
            return Duration.ofHours(hours);
        } else if (lower.contains("minute")) {
            int minutes = Integer.parseInt(lower.split(" ")[0]);
            return Duration.ofMinutes(minutes);
        } else {
            throw new RuntimeException("Invalid duration format: " + durationText);
        }
    }


}




/*

public Booking createBooking(BookingRequestDTO bookingRequest) {
        BookingType bookingType = bookingRequest.getBookingType();
        LocalDateTime startDateTime = bookingRequest.getStartDateTime();
        LocalDateTime endDateTime;

        Booking booking = new Booking();
        booking.setCustomerName(bookingRequest.getCustomerName());
        booking.setEmail(bookingRequest.getEmail());
        booking.setPhoneNumber(bookingRequest.getPhoneNumber());
        booking.setLocation(bookingRequest.getLocation());
        booking.setNotes(bookingRequest.getNotes());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus("PENDING");
        booking.setBookingType(bookingType);

        if (bookingType == BookingType.PHOTOGRAPHY) {
            PhotographyService service = photographyServiceRepository
                    .findById(bookingRequest.getPhotographyServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found"));

            Duration duration = parseDuration(service.getDuration());
            endDateTime = startDateTime.plus(duration);
            booking.setPhotographyService(service);

        } else if (bookingType == BookingType.CONSULTATION) {
            endDateTime = startDateTime.plusMinutes(30);
            booking.setPhotographyService(null); // No service for consultation
        } else {
            throw new RuntimeException("Unsupported booking type: " + bookingType);
        }

        // Slot validation for both types
        Long serviceId = (bookingType == BookingType.PHOTOGRAPHY)
                ? bookingRequest.getPhotographyServiceId()
                : null;

        boolean slotAvailable = bookingRepository.findOverlappingBookings(
                serviceId, startDateTime, endDateTime
        ).isEmpty();

        if (!slotAvailable) {
            throw new RuntimeException("Selected time slot is not available");
        }

        booking.setStartDateTime(startDateTime);
        booking.setEndDateTime(endDateTime);

        return bookingRepository.save(booking);
    }


 */

 /*
    This service handles:

        Duration parsing from text (like "2 hours")
        End time calculation
        Slot availability check
        Booking creation
     */