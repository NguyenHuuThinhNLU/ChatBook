package com.dev.profile_service.mapper;

import org.mapstruct.Mapper;

import com.dev.profile_service.dto.request.ProfileCreateRequest;
import com.dev.profile_service.dto.response.UserProfileResponse;
import com.dev.profile_service.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(ProfileCreateRequest request);

    UserProfileResponse toUserProfileResponse(UserProfile userProfile);
}
