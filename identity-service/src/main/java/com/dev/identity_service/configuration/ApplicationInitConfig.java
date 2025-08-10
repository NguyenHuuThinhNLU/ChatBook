package com.dev.identity_service.configuration;

import com.dev.identity_service.constant.PredefinedRole;
import com.dev.identity_service.entity.Role;
import com.dev.identity_service.entity.User;
import com.dev.identity_service.repository.RoleRepository;
import com.dev.identity_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USERNAME = "admin";
    @NonFinal
    static final String ADMIN_PASSWORD = "admin123";

    @Bean
    @ConditionalOnProperty(prefix = "spring", value = "datasource.driverClassName", havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Initializing application with MySQL database...");
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                log.info("Initializing application.....");
                roleRepository.save(Role.builder().name(PredefinedRole.USER_ROLE).description("Default user role with basic permissions").build());

                Role adminRole = roleRepository.save(Role.builder().name(PredefinedRole.ADMIN_ROLE).description("Admin role").build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder().username(ADMIN_USERNAME).password(passwordEncoder.encode(ADMIN_PASSWORD)).roles(roles).build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
