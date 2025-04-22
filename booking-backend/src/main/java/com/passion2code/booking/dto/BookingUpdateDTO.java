package com.passion2code.booking.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingUpdateDTO {
    private String customerName;
    private String email;
    private String phoneNumber;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private String notes;
}
