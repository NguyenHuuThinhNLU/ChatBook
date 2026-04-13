package com.dev.notification_service.configuration;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.dev.notification_service.dto.ApiResponse;
import com.dev.notification_service.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMsg())
                .build();

        ObjectMapper onjectMapper = new ObjectMapper();
        String jsonResponse = onjectMapper.writeValueAsString(apiResponse); // Convert ApiResponse to JSON string
        response.getWriter().write(jsonResponse);

        response.flushBuffer(); // Flush the response buffer to ensure the response is sent immediately
        // Gui thông báo lỗi về phía client
    }
}
