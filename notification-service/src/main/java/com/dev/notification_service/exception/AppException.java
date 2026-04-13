package com.dev.notification_service.exception;

public class AppException extends RuntimeException {
    // Custom exception class to handle application-specific errors
    private ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMsg());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
