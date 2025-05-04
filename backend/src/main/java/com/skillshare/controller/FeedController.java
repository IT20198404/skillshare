package com.skillshare.controller;

import com.skillshare.model.*;
import com.skillshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final SkillPostRepository skillPostRepo;
    private final LearningProgressRepository progressRepo;
    private final LearningPlanRepository planRepo;
    private final UserProfileRepository userProfileRepo;
    private final LikeRepository likeRepo;
    private final CommentRepository commentRepo;

    @GetMapping
    public List<Map<String, Object>> getFeed() {
        List<Map<String, Object>> feed = new ArrayList<>();

        // Skill Posts
        skillPostRepo.findAll().forEach(post -> {
            userProfileRepo.findByEmail(post.getUserEmail()).ifPresent(profile -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", post.getId());
                item.put("category", "Skill");
                item.put("description", post.getDescription());
                item.put("mediaUrls", post.getMediaUrls());
                item.put("fullName", profile.getFirstName() + " " + profile.getLastName());
                item.put("profilePicUrl", profile.getProfilePicUrl());
                item.put("timestamp", post.getId());
                item.put("likedUsers", likeRepo.findByPostId(post.getId()));
                item.put("comments", commentRepo.findByPostId(post.getId()));
                feed.add(item);
            });
        });

        // Learning Progress
        progressRepo.findAll().forEach(progress -> {
            userProfileRepo.findByEmail(progress.getUserEmail()).ifPresent(profile -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", progress.getId());
                item.put("category", "Learning Progress");
                item.put("message", progress.getMessage());
                item.put("fullName", profile.getFirstName() + " " + profile.getLastName());
                item.put("profilePicUrl", profile.getProfilePicUrl());
                item.put("timestamp", progress.getId());
                item.put("likedUsers", new ArrayList<>()); // placeholder
                item.put("comments", new ArrayList<>());
                feed.add(item);
            });
        });

        // Learning Plans
        planRepo.findAll().forEach(plan -> {
            userProfileRepo.findByEmail(plan.getUserEmail()).ifPresent(profile -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", plan.getId());
                item.put("category", "Learning Plan");
                item.put("topic", plan.getTopic());
                item.put("resources", plan.getResources());
                item.put("deadline", plan.getDeadline());
                item.put("fullName", profile.getFirstName() + " " + profile.getLastName());
                item.put("profilePicUrl", profile.getProfilePicUrl());
                item.put("timestamp", plan.getId());
                item.put("likedUsers", new ArrayList<>()); // placeholder
                item.put("comments", new ArrayList<>());
                feed.add(item);
            });
        });

        return feed.stream()
                .sorted((a, b) -> b.get("timestamp").toString().compareTo(a.get("timestamp").toString()))
                .collect(Collectors.toList());
    }
}
