package com.dev.event.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NotificationEvent {
    String channel; // Mot kenh nhu : zalo , gmail
    String receiver; // nguoi nhan
    String templateCode;
    Map<String, Object> param; // Thong tin de dua vao email
    String subject;
    String body;
}
