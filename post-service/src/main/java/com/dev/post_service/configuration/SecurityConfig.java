package com.dev.post_service.configuration;

import com.dev.post_service.configuration.CustomJwtDecoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Cho phep su dung @PreAuthorize, @PostAuthorize, @Secured, @RolesAllowed
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINT = {"/email/send"}; // DS cac endpoint public

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINT)
                .permitAll()
                //                .hasAnyAuthority("ROLE_ADMIN")
                .anyRequest()
                .authenticated());

        // Cung cap cho header 1 authentication token co the cho decoder moi co the hieu duoc token
        http.oauth2ResourceServer(
                oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())) // Cung cap cach ma hoa token
                        .authenticationEntryPoint(
                                new JwtAuthenticationEntryPoint()) // Khi authentication failed thi se dieu huong cho
                // user toi JwtAuthenticationEntryPoint
                );

        http.csrf(AbstractHttpConfigurer::disable); // bao ve endpoint truoc cross
        return http.build();
    }

    // Cung cap de co the customize cach ma hoa token
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Cung cap cach ma hoa token, co the thay doi cach ma hoa token
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    // Cung cap cors filter de cho phep cac request tu ben ngoai truy cap vao API
    // CorsFilter cho phep cac request tu ben ngoai truy cap vao API
    // Tranh CORS (Cross-Origin Resource Sharing) error khi frontend va backend khac domain

}
