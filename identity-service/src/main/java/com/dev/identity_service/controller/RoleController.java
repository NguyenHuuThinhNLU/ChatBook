package com.dev.identity_service.controller;

import com.dev.identity_service.dto.request.ApiResponse;
import com.dev.identity_service.dto.request.RoleRequest;
import com.dev.identity_service.dto.response.RoleResponse;
import com.dev.identity_service.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getALlRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    @DeleteMapping("/{name}")
    ApiResponse<Void> deleteRole(String name) {
        roleService.deteleRole(name);
        return ApiResponse.<Void>builder().build();
    }

}
