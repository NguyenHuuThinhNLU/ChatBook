package com.dev.identity_service.dto.request;

import com.dev.identity_service.validator.DobConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE) // Moi field se co access level private
public class UserRequest {

    @Size(min = 3, max = 20, message = "USERNAME_INVALID")
    String username;

    @Size(min = 6, message = "PASSWORD_INVALID")
    String password;
    String firstName;
    String lastName;

    String email;

    @DobConstraint(min = 16, message = "INVALID_DOB")
    LocalDate dob;

    String city;
}
