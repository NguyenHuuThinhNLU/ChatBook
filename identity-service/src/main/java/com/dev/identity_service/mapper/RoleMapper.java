package com.dev.identity_service.mapper;

import com.dev.identity_service.dto.request.RoleRequest;
import com.dev.identity_service.dto.response.RoleResponse;
import com.dev.identity_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
        // Ignore permissions field for now
    Role toRole(RoleRequest role);

    RoleResponse toResponse(Role role);

}
