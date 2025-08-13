package com.dev.profile_service.repository;

import com.dev.profile_service.entity.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
}
