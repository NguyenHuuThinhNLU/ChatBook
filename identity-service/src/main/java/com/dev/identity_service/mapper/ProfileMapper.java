package com.dev.identity_service.mapper;

import com.dev.identity_service.dto.request.UserProfileCreationRequest;
import com.dev.identity_service.dto.request.UserRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    UserProfileCreationRequest toUserProfileCreationRequest(UserRequest request);
}
