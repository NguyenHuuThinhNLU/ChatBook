package com.dev.profile_service.controller;

import com.dev.profile_service.dto.request.ProfileCreateRequest;
import com.dev.profile_service.dto.response.UserProfileResponse;
import com.dev.profile_service.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class InternalUserProfileController {

    @Autowired
    UserProfileService userProfileService;

    @PostMapping(value = "/internal/users")
    public UserProfileResponse createProfile(@RequestBody ProfileCreateRequest request) {
        return userProfileService.createProfile(request);
    }

}
