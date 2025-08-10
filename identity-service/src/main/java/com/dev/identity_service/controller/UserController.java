package com.dev.identity_service.controller;

import com.dev.identity_service.dto.request.ApiResponse;
import com.dev.identity_service.dto.request.UserRequest;
import com.dev.identity_service.dto.request.UserUpdateRequest;
import com.dev.identity_service.dto.response.UserResponse;
import com.dev.identity_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserRequest userRequest) {
        log.info("Controller: Create user");
        // Validate the request body using @Valid annotation
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(userRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication(); // Chua thong tin user dang nhap hien tai

        //Kiểm tra xem người dùng đã đăng nhập hay chưa
        log.info("Current user: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority ->
                log.info(grantedAuthority.getAuthority()));

        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }


    @GetMapping("/{userid}")
    UserResponse getUser(@PathVariable String userid) {
        return userService.findById(userid);
    }

    @PutMapping("/{userid}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userid, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>
                        builder()
                .result(userService.updatUser(userid, request))
                .build();

    }

    @DeleteMapping("/{userid}")
    String deleteUser(@PathVariable String userid) {
        userService.deleteUser(userid);
        return "user with id " + userid + " deleted successfully";
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getInfo())
                .build();
    }


}
