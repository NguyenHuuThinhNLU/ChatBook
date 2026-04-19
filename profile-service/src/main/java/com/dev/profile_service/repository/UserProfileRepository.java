package com.dev.profile_service.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.dev.profile_service.entity.UserProfile;

import java.util.Optional;

public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
}
