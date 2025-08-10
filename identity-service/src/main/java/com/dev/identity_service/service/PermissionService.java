package com.dev.identity_service.service;

import com.dev.identity_service.dto.request.PermissionRequest;
import com.dev.identity_service.dto.response.PermissionResponse;
import com.dev.identity_service.entity.Permission;
import com.dev.identity_service.mapper.PermissionMapper;
import com.dev.identity_service.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        Permission permission = permissionMapper.toEntity(request);
        permission = permissionRepository.save(permission);
        return permissionMapper.toResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toResponse).toList();
    }

    public void delete(String permission) {
        permissionRepository.deleteById(permission);
    }


}
