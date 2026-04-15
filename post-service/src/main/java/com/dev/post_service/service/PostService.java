package com.dev.post_service.service;

import com.dev.post_service.dto.ApiResponse;
import com.dev.post_service.dto.request.PostRequest;
import com.dev.post_service.dto.response.PostResponse;
import com.dev.post_service.entity.Post;
import com.dev.post_service.mapper.PostMapper;
import com.dev.post_service.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;


    public PostResponse createPost(PostRequest postRequest) {
        // get user id in token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        Post post = Post.builder()
                .content(postRequest.getContent())
                .userId(authentication.getName())  // get subject  (uid)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .build();

        postRepository.save(post);

        return postMapper.toPostResponse(post);
    }

    public List<PostResponse> getMyPost() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();


        return postRepository.findAllByUserId(userId).stream().map(postMapper::toPostResponse).toList();
    }

}

