package com.dev.profile_service.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNAUTHORIZED(1008, "You do not have permission", HttpStatus.FORBIDDEN);

    ErrorCode(int code, String msg, HttpStatus httpStatus) {
        this.code = code;
        this.msg = msg;
        this.httpStatus = httpStatus;
    }

    private final int code;
    private final String msg;
    private final HttpStatus httpStatus;
}
