package com.passion2code.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServiceBookingCountDTO {
    private String serviceName;
    private long count;
}
