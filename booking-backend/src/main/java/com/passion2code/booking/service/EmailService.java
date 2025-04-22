package com.passion2code.booking.service;

import com.passion2code.booking.entity.Booking;
import com.passion2code.booking.enums.BookingType;
import com.passion2code.booking.repository.BookingRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.MimeMessageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final BookingRepository bookingRepository;
    private final StripeService stripeService;
    private final JavaMailSender mailSender;
    private final SmsService smsService;
    @Value("${EMAIL_USERNAME}")
    private String from;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");
    /*
    public void sendReminderEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    */

    public void sendReminderEmail(String to, String subject, String bodyHtml) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(bodyHtml, true); // true = send as HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }


    public void sendBookingConfirmation(String to, String name, String type, String dateTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Booking Confirmation - " + type);
            helper.setFrom(from);
            helper.setText(
                    "<h3>Hi " + name + ",</h3>" +
                            "<p>Thank you for booking a <strong>" + type + "</strong>.</p>" +
                            "<p>Your appointment is confirmed for <strong>" + dateTime + "</strong>.</p>" +
                            "<p>We're excited to serve you!</p>" +
                            "<br/><p><em>Passion2Code Team</em></p>",
                    true
            );

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendCancellationEmail(String to, String name, String bookingType, String dateTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("❌ Your Booking Has Been Canceled");
            helper.setFrom(from);
            helper.setText(
                    "<h3>Hi " + name + ",</h3>" +
                            "<p>We're reaching out to let you know that your <strong>" + bookingType + "</strong> booking scheduled for <strong>" + dateTime + "</strong> has been <strong>canceled</strong>.</p>" +
                            "<p>If you have any questions, feel free to contact us.</p>" +
                            "<br/><p>Best regards,<br/>Passion2Code Booking Team</p>",
                    true
            );

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send cancellation email: " + e.getMessage());
        }
    }


    @Scheduled(fixedRate = 1000 * 60 * 30) // every 30 minutes
    public void sendUpcomingBookingReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixHoursLater = now.plusHours(6);

        List<Booking> bookings = bookingRepository.findUpcomingConfirmedBookings(now, sixHoursLater);
        log.info("✅ Found {} confirmed bookings to remind.", bookings.size());

        for (Booking booking : bookings) {
            try {
                String formattedDateTime = booking.getStartDateTime()
                        .format(DateTimeFormatter.ofPattern("EEEE, MMM d, yyyy 'at' h:mm a"));

                String bookingType = booking.getBookingType().toString().toLowerCase();
                String htmlBody = """
                <p>Hello <strong>%s</strong>,</p>
                <p>This is a reminder for your upcoming <strong>%s</strong> booking scheduled for:</p>
                <p style="font-size: 1.2em;"><strong>%s</strong></p>
                <p>Please arrive on time. We’re excited to serve you!</p>
                <br/>
                <p>Best regards,<br/>Passion2Code Booking Team</p>
                """.formatted(
                        booking.getCustomerName(),
                        booking.getBookingType().toString().toLowerCase(),
                        formattedDateTime
                );

                sendReminderEmail(
                        booking.getEmail(),
                        "⏰ Reminder: Your upcoming booking",
                        htmlBody
                );

                Boolean smsSent = false;


                // ✅ Send SMS (right here!)
                if (booking.getPhoneNumber() != null && !booking.getPhoneNumber().isBlank()) {
                    String smsMessage = """
                    Reminder: You have a confirmed %s booking at %s.
                    Please be on time. - Passion2Code Team
                """.formatted(booking.getBookingType(), formattedDateTime);

                    smsService.sendSms(booking.getPhoneNumber(), smsMessage);

                    smsSent = true;
                    log.info("✅ SMS Reminder sent for booking PHONE NUMBER : {}", booking.getPhoneNumber());

                } else {
                    log.info("✅ SMS Reminder NOT sent for booking ID: {}", booking.getId());
                }

                booking.setReminderSent(true);
                bookingRepository.save(booking);
                log.info("✅ Reminder sent for booking ID: {}", booking.getId());

            } catch (Exception e) {
                log.error("❌ Failed to send reminder for booking ID {}: {}", booking.getId(), e.getMessage());
            }
        }
    }




    // Runs every 6 hours (adjust as needed)
    // @Scheduled(fixedRate = 30 * 1000) // Every 30 seconds (just for testing)
    //@Scheduled(fixedRate = 1000 * 60 * 60 * 6) // Every 6 hours
    @Scheduled(fixedRate = 1000 * 60 * 60 * 6)
    public void sendAutomaticReminders() {

        LocalDateTime cutoff = LocalDateTime.now().minusHours(12); // Pending for more than 12 hours

       // LocalDateTime cutoff = LocalDateTime.now().minusMinutes(1); // short interval for testing

        List<Booking> pendingBookings = bookingRepository.findPendingBookingsWithoutReminder(cutoff);

        log.info("Pending bookings found: {}", pendingBookings.size());

        for (Booking booking : pendingBookings) {

            try {
                String subject;
                String emailBody;
                String payLaterUrl = "";
                String formattedDateTime = booking.getStartDateTime().format(formatter);

                // Only generate Stripe link for photography Services
                if (booking.getBookingType() == BookingType.PHOTOGRAPHY) {
                    if (booking.getPhotographyService() == null) {
                        log.warn("Booking ID {} has null photography service", booking.getId());
                        continue;
                    }
                    payLaterUrl = stripeService.createCheckoutSession(
                            booking.getId(),
                            booking.getPhotographyService().getDepositAmount()
                    );
                    subject = "⏳ Complete Your Photography Booking Payment";
                    emailBody = buildPhotographyEmail(booking.getCustomerName(), formattedDateTime, payLaterUrl);

                    sendReminderEmail(booking.getEmail(), subject, emailBody);
                    booking.setReminderSent(true);
                    bookingRepository.save(booking);
                    log.info("✅ Reminder sent for booking ID: {}", booking.getId());

                }
                /*
                else {
                    subject = "📅 Reminder: Consultation Booking";
                    emailBody = buildConsultationEmail(booking.getCustomerName(), formattedDateTime);
                }
                */





                /*
                String body = "Hello " + booking.getCustomerName() + ",\n\n" +
                        "You have a pending booking. Please complete your payment by clicking below:\n" +
                        payLaterUrl + "\n\n" +
                        "Thank you!";
                */


            } catch (Exception e) {
                log.error("Failed to send reminder for booking ID {}: {}", booking.getId(), e.getMessage());
            }
        }
    }


    public void sendContactMessage(String fromEmail, String name, String subject, String messageText) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(from); // your email
            helper.setSubject("📬" + subject);
            helper.setText(
                    "<p><strong>Name:</strong> " + name + "</p>" +
                            "<p><strong>Email:</strong> " + fromEmail + "</p>" +
                            "<p><strong>Message:</strong><br/>" + messageText + "</p>",
                    true
            );

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send contact message: " + e.getMessage());
        }
    }




    private String buildPhotographyEmail(String name, String formattedDateTime, String payLaterUrl) {
        return """
            <p>Hello <strong>%s</strong>,</p>
            <p>You have a pending booking for <strong>Photography</strong> on <strong>%s</strong>.</p>
            <p>Please confirm your deposit payment by clicking the button below:</p>
            <p style="text-align:center; margin: 24px 0;">
              <a href="%s" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
                ✅ Complete Your Booking
              </a>
            </p>
            <p>If the button doesn't work, copy and paste the link below in your browser:</p>
            <p><a href="%s">%s</a></p>
            <p>Thanks,<br/>Passion2Code Booking Team</p>
        """.formatted(name, formattedDateTime, payLaterUrl, payLaterUrl, payLaterUrl);
    }

    private String buildConsultationEmail(String name, String formattedDateTime) {
        return """
            <p>Hello <strong>%s</strong>,</p>
            <p>This is a friendly reminder about your pending <strong>Consultation</strong> on <strong>%s</strong>.</p>
            <p>No payment is required, but we encourage you to keep your schedule or contact us if you need to reschedule.</p>
            <p>Thanks,<br/>Passion2Code Booking Team</p>
        """.formatted(name, formattedDateTime);
    }


}
