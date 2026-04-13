package com.dev.notification_service.controller;

import com.dev.event.dto.NotificationEvent;
import com.dev.notification_service.dto.request.Receiver;
import com.dev.notification_service.dto.request.SendEmailRequest;
import com.dev.notification_service.service.EmailService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    EmailService emailService;


    @KafkaListener(topics = "notification-delivery")
    public void listenNotificationDelivery(NotificationEvent message) {
        log.info("Message receive: {}", message);
        emailService.sendEmail(SendEmailRequest.builder()
                        .to(Receiver.builder()
                                .email(message.getReceiver())
                                .build())
                        .subject(message.getSubject())
                        .htmlContent(message.getBody())
                .build());

    }
}
