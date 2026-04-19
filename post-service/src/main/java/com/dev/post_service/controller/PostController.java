package com.dev.post_service.controller;

import com.dev.post_service.dto.ApiResponse;
import com.dev.post_service.dto.PageResponse;
import com.dev.post_service.dto.request.PostRequest;
import com.dev.post_service.dto.response.PostResponse;
import com.dev.post_service.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @PostMapping("/create-post")
    ApiResponse<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(postRequest))
                .build();
    }

    @GetMapping("/my-posts")
    ApiResponse<PageResponse<PostResponse>> myPost(@RequestParam(value = "page", required = true, defaultValue = "1") int page,
                                                   @RequestParam(value = "size", required = true, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getMyPost (page,  size))
                .build();
    }


}
