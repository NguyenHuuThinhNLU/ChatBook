package com.dev.profile_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.dev.profile_service.dto.request.ApiResponse;
import com.dev.profile_service.dto.response.UserProfileResponse;
import com.dev.profile_service.service.UserProfileService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {

    @Autowired
    UserProfileService userProfileService;

    @GetMapping(value = "/users/my-profile")
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.<UserProfileResponse>builder()
                .result(userProfileService.getMyProfile())
                .build();
    }

    @GetMapping(value = "/users/{profileId}")
    public UserProfileResponse getProfile(@PathVariable String profileId) {
        return userProfileService.getProfile(profileId);
    }

    @DeleteMapping(value = "/users/{profileId}")
    public void deleteProfile(@PathVariable String profileId) {
        userProfileService.deleteProfile(profileId);
    }

    @GetMapping("/users")
    List<UserProfileResponse> getAllProfiles() {
        return userProfileService.getAllProfiles();
    }
}
