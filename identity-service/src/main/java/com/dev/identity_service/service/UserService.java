package com.dev.identity_service.service;

import com.dev.event.dto.NotificationEvent;
import com.dev.identity_service.constant.PredefinedRole;
import com.dev.identity_service.dto.request.UserRequest;
import com.dev.identity_service.dto.request.UserUpdateRequest;
import com.dev.identity_service.dto.response.UserResponse;
import com.dev.identity_service.entity.Role;
import com.dev.identity_service.entity.User;
import com.dev.identity_service.exception.AppException;
import com.dev.identity_service.exception.ErrorCode;
import com.dev.identity_service.mapper.ProfileMapper;
import com.dev.identity_service.mapper.UserMapper;
import com.dev.identity_service.repository.RoleRepository;
import com.dev.identity_service.repository.UserRepository;
import com.dev.identity_service.repository.httpclient.ProfileClient;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
// All fields will be private, khong khai bao thi se la final
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    ProfileClient profileClient;
    ProfileMapper profileMapper;
    KafkaTemplate<String, Object> kafkaTemplate;


    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request); // Convert UserRequest to User entity
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password before saving

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);
        user.setEmailVerified(false);
        try {
            user = userRepository.save(user); // Save the user to the database
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }


        var profileRequest = profileMapper.toUserProfileCreationRequest(request); // Convert UserRequest to UserProfileCreationRequest
        profileRequest.setUserId(user.getUid());

        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        var authHeader = servletRequestAttributes.getRequest().getHeader("Authorization");

        log.info("Authorization Header: {}", authHeader);

        profileClient.createProfile(profileRequest); // Call the ProfileClient to create a user profile



        // publish messag to kafka
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .receiver(request.getEmail())
                .subject("Welcome to bookteria")
                .body("Hello, " + request.getUsername())
                .build();

        // Publish message to kafka
        kafkaTemplate.send("notification-delivery", notificationEvent);


        return userMapper.toUserResponse(user); // Convert User entity to UserResponse DTO
    }


    // PreAuthorize annotation is used to restrict access to this method based on user roles
    //@PreAuthorize("hasRole('ADMIN')") // Only users with ADMIN role can access this method
    // PreAuthorize se kiem tra quyen truoc khi thuc hien phuong thuc
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("Fetching all users from the database");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList(); // ham finds all users in the database
    }

    @PostAuthorize("returnObject.username == authentication.name")
    // PostAuthorize se kiem tra quyen sau khi thuc hien phuong thuc
    public UserResponse findById(String userid) {
        return userMapper.toUserResponse(userRepository.findById(userid).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST)));
    }

    public UserResponse updateUser(String uid, UserUpdateRequest request) {
        User user = userRepository.findById(uid).orElseThrow(() -> new RuntimeException("User not found with id: " + uid));
        userMapper.upadateUser(user, request);
        // Update user roles if provided
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password before saving

        var role = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(role)); // Set roles from the request

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String uid) {
        User user = userRepository.findById(uid).orElseThrow(() -> new RuntimeException("User not found with id: " + uid));
        userRepository.delete(user);
    }

    public UserResponse getInfo() {
        var context = SecurityContextHolder.getContext(); // Get the current authentication context
        String name = context.getAuthentication().getName(); // Get the username of the authenticated user

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));
        return userMapper.toUserResponse(user); // Map the User entity to UserResponse DTO
    }

}