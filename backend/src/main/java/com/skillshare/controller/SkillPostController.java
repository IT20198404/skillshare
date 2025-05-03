package com.skillshare.controller;

import com.skillshare.model.SkillPost;
import com.skillshare.repository.SkillPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class SkillPostController {

    private final SkillPostRepository repo;

    @PostMapping
    public ResponseEntity<?> uploadPost(
        @RequestParam("media") List<MultipartFile> media,
        @RequestParam("description") String description,
        @AuthenticationPrincipal OAuth2User principal
    ) throws Exception {
        String email = principal.getAttribute("email");
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : media) {
            String name = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + name);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            urls.add("/uploads/" + name);
        }

        SkillPost post = new SkillPost(null, email, description, urls);
        return ResponseEntity.ok(repo.save(post));
    }

    @GetMapping
    public List<SkillPost> getMyPosts(@AuthenticationPrincipal OAuth2User principal) {
        return repo.findByUserEmail(principal.getAttribute("email"));
    }
}
