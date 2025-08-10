package com.dev.identity_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data // Lombok will generate getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Tao constructor co tham so
@NoArgsConstructor // Tao constructor khong tham so
@Builder // ạo Builder Pattern cho class → giúp khởi tạo object kiểu chain method.
@FieldDefaults(level = lombok.AccessLevel.PRIVATE) // All fields will be private
public class UserUpdateRequest {
    String password;
    String firstName;
    String lastName;
    LocalDate dob;
    List<String> roles; // List of role names to update the user's roles
}
