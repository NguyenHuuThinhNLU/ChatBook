package com.dev.notification_service.service;

import java.util.List;

import com.dev.notification_service.exception.AppException;
import org.springframework.stereotype.Service;

import com.dev.notification_service.dto.request.EmailRequest;
import com.dev.notification_service.dto.request.SendEmailRequest;
import com.dev.notification_service.dto.request.Sender;
import com.dev.notification_service.dto.response.EmailResponse;
import com.dev.notification_service.exception.ErrorCode;
import com.dev.notification_service.repository.httpclient.EmailClient;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    EmailClient emailClient;

    String apiKey = "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";

    public EmailResponse sendEmail(SendEmailRequest request) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("Dev Huu Thinh")
                        .email("thinhnguyen23052004@gamil.com")
                        .build())
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .htmlContent(request.getHtmlContent())
                .build();

        try {
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            throw new AppException(ErrorCode.CANNOT_SEND_EMAIL);
        }
    }
}
