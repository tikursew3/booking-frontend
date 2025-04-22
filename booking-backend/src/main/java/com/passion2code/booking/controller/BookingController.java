package com.passion2code.booking.controller;

import com.passion2code.booking.dto.*;
import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.enums.BookingType;
import com.passion2code.booking.repository.BookingRepository;
import com.passion2code.booking.repository.PaymentRepository;

import com.passion2code.booking.service.BookingService;
import com.passion2code.booking.service.EmailService;
import com.passion2code.booking.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    /*
        Method	    Endpoint	        Purpose
        POST	/api/bookings	Create a new booking (with availability check)
        GET	    /api/bookings	Retrieve all bookings (for admin usage)
     */

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final StripeService stripeService;
    private final EmailService emailService;
    private final PaymentRepository paymentRepository;


    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDTO bookingRequestDTO) {
        Booking savedBooking = bookingService.createBooking(bookingRequestDTO);
        return ResponseEntity.ok(savedBooking);
    }


    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    /*

    @PostMapping("/send-reminder/{bookingId}")
    public ResponseEntity<?> sendReminder(@PathVariable Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body("Booking is not pending");
        }

        try {
            // Generate pay-later URL from Stripe
            String payLaterUrl = stripeService.createCheckoutSession(
                    booking.getId(),
                    booking.getPhotographyService().getDepositAmount());

            // Compose email body
            //String body = "Hello " + booking.getCustomerName() + ",\n\n" +
                   // "You have a pending booking. Please complete your payment here:\n" +
                   // payLaterUrl + "\n\n" +
                   // "Thank you!\nPhotography Booking Team";

            String bodyHtml = """
                    <p>Hello <strong>%s</strong>,</p>
                    <p>You have a pending booking. To complete your reservation, please confirm your deposit payment by clicking the button below:</p>
                    <p style="text-align:center; margin: 24px 0;">
                      <a href="%s" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
                        ✅ Complete Your Booking
                      </a>
                    </p>
                    <p>If the button doesn't work, copy and paste the link below in your browser:</p>
                    <p><a href="%s">%s</a></p>
                    <p>Thanks,<br/>Passion2Code Booking Team</p>
                    """.formatted(
                                    booking.getCustomerName(),
                                    payLaterUrl,
                                    payLaterUrl,
                                    payLaterUrl
                            );

            // Send email
            emailService.sendReminderEmail(booking.getEmail(),
                    "Complete Your Photography Booking Payment",
                    bodyHtml);

            return ResponseEntity.ok("Reminder email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    "Failed to send reminder email: " +
                            e.getMessage());
        }
    }
*/
    @GetMapping("/calendar")
    public List<BookingCalendarEventDTO> getCalendarBookings() {
        return bookingService.getCalendarEvents();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    // 🔒 Only allow canceling if booking is PENDING or CONFIRMED
                    if (!booking.getStatus().equals("PENDING") && !booking.getStatus().equals("CONFIRMED")) {
                        return ResponseEntity.badRequest().body("Only pending or confirmed bookings can be cancelled.");
                    }
                    booking.setStatus("CANCELLED");
                    bookingRepository.save(booking);
                    return ResponseEntity.ok(booking);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingUpdateDTO dto) {
        return bookingRepository.findById(id)
                .map(existing -> {
                    existing.setCustomerName(dto.getCustomerName());
                    existing.setEmail(dto.getEmail());
                    existing.setPhoneNumber(dto.getPhoneNumber());
                    existing.setStartDateTime(dto.getStartDateTime());
                    existing.setEndDateTime(dto.getEndDateTime());
                    existing.setLocation(dto.getLocation());
                    existing.setNotes(dto.getNotes());

                    bookingRepository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/admin/dashboard-summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        long total = bookingRepository.count();
        long pending = bookingRepository.countByStatus("PENDING");
        long confirmed = bookingRepository.countByStatus("CONFIRMED");
        long cancelled = bookingRepository.countByStatus("CANCELLED");
        long consults = bookingRepository.countByBookingType(BookingType.CONSULTATION);
        long photos = bookingRepository.countByBookingType(BookingType.PHOTOGRAPHY);
        double totalPaid = paymentRepository.sumAllPaidAmount(); // custom query

        DashboardSummaryDTO summary = DashboardSummaryDTO.builder()
                .totalBookings(total)
                .pendingBookings(pending)
                .confirmedBookings(confirmed)
                .cancelledBookings(cancelled)
                .consultationCount(consults)
                .photographyCount(photos)
                .totalPayments(totalPaid)
                .build();

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/admin/bookings-by-service")
    public List<ServiceBookingCountDTO> getBookingsByService() {
        return bookingRepository.countBookingsByService();
    }






}
