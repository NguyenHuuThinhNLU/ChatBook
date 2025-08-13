package com.dev.profile_service.mapper;

import com.dev.profile_service.dto.request.ProfileCreateRequest;
import com.dev.profile_service.dto.response.UserProfileResponse;
import com.dev.profile_service.entity.UserProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(ProfileCreateRequest request);

    UserProfileResponse toUserProfileResponse(UserProfile userProfile);

}
