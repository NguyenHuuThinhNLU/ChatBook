package com.dev.post_service.service;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class DateTimeFormatter {

    public String format(Instant instant) {
        return instant.toString();
    }

}
