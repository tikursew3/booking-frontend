package com.passion2code.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCalendarEventDTO {
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
    private String bookingType;
}
