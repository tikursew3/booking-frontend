package com.passion2code.booking.dto;

import com.passion2code.booking.enums.BookingType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequestDTO {
    private String customerName;
    private String email;
    private String phoneNumber;
    private Long photographyServiceId; // Optional for consultation
    private LocalDateTime startDateTime;
    private String location;
    private String notes;
    private BookingType bookingType; // PHOTOGRAPHY or CONSULTATION
}
