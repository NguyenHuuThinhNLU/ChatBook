package com.dev.profile_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dev.profile_service.dto.request.ProfileCreateRequest;
import com.dev.profile_service.dto.response.UserProfileResponse;
import com.dev.profile_service.entity.UserProfile;
import com.dev.profile_service.mapper.UserProfileMapper;
import com.dev.profile_service.repository.UserProfileRepository;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UserProfileService {
    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    UserProfileMapper userProfileMapper;

    public UserProfileResponse createProfile(ProfileCreateRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);

        userProfile = userProfileRepository.save(userProfile);
        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile =
                userProfileRepository.findById(id).orElseThrow(() -> new RuntimeException("User profile not found"));
        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getMyProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // JWT subject (uid)

        UserProfile userProfile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public void deleteProfile(String id) {
        userProfileRepository.deleteById(id);
        log.info("User profile with id {} deleted successfully", id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> getAllProfiles() {
        var profiles = userProfileRepository.findAll();

        return profiles.stream().map(userProfileMapper::toUserProfileResponse).toList();
    }
}
