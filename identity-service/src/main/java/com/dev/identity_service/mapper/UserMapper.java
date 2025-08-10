package com.dev.identity_service.mapper;

import com.dev.identity_service.dto.request.UserRequest;
import com.dev.identity_service.dto.request.UserUpdateRequest;
import com.dev.identity_service.dto.response.UserResponse;
import com.dev.identity_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // map UserRequest to User entity
    User toUser(UserRequest userRequest);

    //@Mapping(source = "firstName", target = "lastName")
    //@Mapping(target = "lastName", ignore = true) // bo qua lastName field
    @Mapping(target = "roles", ignore = true)
    // Ignore roles field during mapping
    void upadateUser(@MappingTarget User user, UserUpdateRequest userUpdateRequest); // Map UserUpdateRequest to User entity

    UserResponse toUserResponse(User user); // Map User entity to UserResponse DTO
}
