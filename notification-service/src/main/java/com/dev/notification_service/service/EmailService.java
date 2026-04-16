package com.dev.notification_service.service;

import java.util.List;

import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dev.notification_service.dto.request.EmailRequest;
import com.dev.notification_service.dto.request.SendEmailRequest;
import com.dev.notification_service.dto.request.Sender;
import com.dev.notification_service.dto.response.EmailResponse;
import com.dev.notification_service.exception.AppException;
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

    @Value("${spring.notification.email.brevo-apikey}")
    @NonFinal
    String apiKey;


    @NonFinal
    @Value("${spring.notification.email.sender-name}")
    String senderName;

    @NonFinal
    @Value("${spring.notification.email.sender-email}")
    String senderEmail;

    public EmailResponse sendEmail(SendEmailRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AppException(ErrorCode.BREVO_API_KEY_MISSING);
        }

        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name(senderName)
                        .email(senderEmail)
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
