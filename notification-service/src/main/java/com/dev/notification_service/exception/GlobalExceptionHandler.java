package com.dev.notification_service.exception;

import java.util.Map;
import java.util.Objects;

import jakarta.validation.ConstraintViolation;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.dev.notification_service.dto.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice // This annotation allows us to handle exceptions globally across all controllers
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value = RuntimeException.class)
    // This method will handle all RuntimeExceptions thrown by any controller
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
        ApiResponse response = new ApiResponse();

        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMsg());
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(response);
    }

    // Custom exception handler for AppException
    @ExceptionHandler(value = AppException.class)
    // This method will handle all RuntimeExceptions thrown by any controller
    ResponseEntity<ApiResponse> handlingRuntimeAppexception(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode(); // retrieves the error code from the custom exception
        ApiResponse response = new ApiResponse();
        response.setCode(errorCode.getCode()); // Custom error code
        response.setMessage(errorCode.getMsg()); // sets the message from the exception
        return ResponseEntity.badRequest()
                .body(response); // returns a bad request(400) response with the custom error code and message
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    // This method will handle validation exceptions
    ResponseEntity<ApiResponse> handlingValidationException(MethodArgumentNotValidException exception) {
        String enumkey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY; // retrieves the error code from the exception
        Map<String, Object> attributes = null;

        try {
            errorCode = ErrorCode.valueOf(enumkey); // converts the enum key to uppercase to match the enum constant

            var constrainViolation =
                    exception.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);

            attributes = constrainViolation.getConstraintDescriptor().getAttributes();
            log.info(attributes.toString());
        } catch (IllegalArgumentException e) {

        }
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(
                Objects.nonNull(attributes) ? mapAttribute(errorCode.getMsg(), attributes) : errorCode.getMsg());

        return ResponseEntity.badRequest()
                .body(apiResponse); // returns a bad request(400) response with the custom error code and message
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMsg())
                        .build());
    }

    private String mapAttribute(String mess, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return mess.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}
