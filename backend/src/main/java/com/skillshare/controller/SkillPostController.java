// File: SkillPostController.java
package com.skillshare.controller;

import com.skillshare.model.SkillPost;
import com.skillshare.repository.SkillPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my-posts") // ✅ Different from /api/posts to prevent conflict
@RequiredArgsConstructor
public class SkillPostController {

    private final SkillPostRepository skillPostRepo;

    @GetMapping
    public List<SkillPost> getMyPosts(@AuthenticationPrincipal OAuth2User user) {
        String email = user.getAttribute("email");
        return skillPostRepo.findByUserEmail(email);
    }
}
