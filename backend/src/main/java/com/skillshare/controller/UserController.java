package com.skillshare.controller;

import com.skillshare.model.UserProfile;
import com.skillshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileRepository profileRepo;
    private final SkillPostRepository skillPostRepository;
    private final LearningPlanRepository learningPlanRepository;
    private final LearningProgressRepository learningProgressRepository;

    // Check if profile is set
    @GetMapping
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", email);
        userInfo.put("profileSet", profileRepo.findByEmail(email).isPresent());
        return userInfo;
    }

    // Save profile after initial login
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam("profilePic") MultipartFile file
    ) throws IOException {
        String email = principal.getAttribute("email");
        String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path path = Paths.get("uploads/" + filename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        UserProfile profile = new UserProfile(null, email, firstName, lastName, "/uploads/" + filename);
        profileRepo.save(profile);
        return ResponseEntity.ok().build();
    }

    // Get profile data
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return profileRepo.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Edit profile (name + optional new profile picture)
    @PutMapping("/profile")
    public ResponseEntity<?> editProfile(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam(value = "profilePic", required = false) MultipartFile file
    ) throws IOException {
        String email = principal.getAttribute("email");

        UserProfile profile = profileRepo.findByEmail(email)
                .orElse(new UserProfile(null, email, "", "", ""));

        profile.setFirstName(firstName);
        profile.setLastName(lastName);

        if (file != null && !file.isEmpty()) {
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            profile.setProfilePicUrl("/uploads/" + filename);
        }

        profileRepo.save(profile);
        return ResponseEntity.ok().build();
    }

    // Delete profile and all related data
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");

        // Delete Skill Posts
        skillPostRepository.deleteAll(skillPostRepository.findByUserEmail(email));

        // Delete Learning Plans
        learningPlanRepository.deleteAll(learningPlanRepository.findByUserEmail(email));

        // Delete Learning Progress
        learningProgressRepository.deleteAll(learningProgressRepository.findByUserEmail(email));

        // Delete Profile
        profileRepo.findByEmail(email).ifPresent(profileRepo::delete);

        return ResponseEntity.ok().build();
    }
}
