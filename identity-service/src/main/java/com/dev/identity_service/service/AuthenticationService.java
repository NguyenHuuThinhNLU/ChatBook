package com.dev.identity_service.service;

import com.dev.identity_service.dto.request.AuthenticationRequest;
import com.dev.identity_service.dto.request.IntrospectRequest;
import com.dev.identity_service.dto.request.LogoutRequest;
import com.dev.identity_service.dto.request.RefreshRequest;
import com.dev.identity_service.dto.response.AuthenticationResponse;
import com.dev.identity_service.dto.response.IntrospectResponse;
import com.dev.identity_service.entity.InvalidatedToken;
import com.dev.identity_service.entity.User;
import com.dev.identity_service.exception.AppException;
import com.dev.identity_service.exception.ErrorCode;
import com.dev.identity_service.repository.InvalidatedTokenRepository;
import com.dev.identity_service.repository.UserRepository;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import org.springframework.util.CollectionUtils;


@Service
@RequiredArgsConstructor
@Slf4j // Using Lombok's @Slf4j for logging
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}") // Injecting the secret key for signing JWTs from application properties
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}") // Injecting the secret key for signing JWTs from application properties
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}") // Injecting the secret key for signing JWTs from application properties
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Signer key: {}", SIGNER_KEY);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
        // If authentication is successful, generate a JWT token
        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();

    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false); // Verify the token and parse it
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    private String generateToken(User user) {
        // Header: Chua thuat toan la gi
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512); // Thuat toan ma hoa la HS512

        // Payload: Chua thong tin nguoi dung
        // Payload chua thong tin nguoi dung, bao gom username, issuer, thoi gian bat dau va het han
        // Bao gom claims: username, issuer, issued at, expiration time
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername()) // Ussername of the user
                .issuer("nguyenthinh.com") // Issuer of the token
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli())) // Token expires in 1 hour
                .jwtID(UUID.randomUUID().toString()) // Unique identifier for the token
                .claim("scope", buildScope(user)) // Example claim, can be roles or permissions
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes())); // Sign the JWS object with the secret key
            return jwsObject.serialize(); // Serialize the JWS object to a string
        } catch (JOSEException e) {
            log.error("Khong the tao token", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    // list roles of user to build scope
    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) user.getRoles().forEach(role -> {
            joiner.add("ROLE_" + role.getName());
            if (!CollectionUtils.isEmpty(role.getPermissions())) role.getPermissions().forEach(permission -> {
                joiner.add(permission.getName());
            });
        });
        return joiner.toString();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        // Verify the token using the secret key
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token); // Parse the JWT token

        //kiem tra token het han
        Date exprirationTime = (isRefresh) ?
                new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime(); // Get the expiration time of the token

        var verified = signedJWT.verify(verifier); // Verify the signature of the token

        // Check if the token is verified and not expired
        if (!(verified && exprirationTime.after(new Date()))) throw new AppException(ErrorCode.AUTHENTICATION_FAILED);

        // Check if the token has been invalidated
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        return signedJWT;
    }


    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID(); // Get the JWT ID from the token
            Date expirationTime = signToken.getJWTClaimsSet().getExpirationTime(); // Get the expiration time of the token

            InvalidatedToken invalidatedToken = InvalidatedToken.builder().id(jit).expiryTime(expirationTime).build();

            invalidatedTokenRepository.save(invalidatedToken);

        } catch (AppException e) {
            log.info("Token already expired");
        }
    }

    // refresh token
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        // kiem tra hieu luc token co hop le hay khong
        var signToken = verifyToken(request.getToken(), true);

        var jit = signToken.getJWTClaimsSet().getJWTID();
        var expirationTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder().id(jit).expiryTime(expirationTime).build();

        invalidatedTokenRepository.save(invalidatedToken); // Save the invalidated token to the database

        // Generate a new token for the user
        var username = signToken.getJWTClaimsSet().getSubject();

        var user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        var token = generateToken(user); // Generate a new token for the user

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true) // Indicate that the user is authenticated
                .build();
    }

}
