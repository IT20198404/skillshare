package com.skillshare.controller;

import com.skillshare.model.LearningProgress;
import com.skillshare.repository.LearningProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class LearningProgressController {

    private final LearningProgressRepository repo;

    @PostMapping
    public LearningProgress save(@RequestBody LearningProgress progress, @AuthenticationPrincipal OAuth2User principal) {
        progress.setUserEmail(principal.getAttribute("email"));
        return repo.save(progress);
    }

    @GetMapping
    public List<LearningProgress> get(@AuthenticationPrincipal OAuth2User principal) {
        return repo.findByUserEmail(principal.getAttribute("email"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return repo.findById(id)
                .filter(progress -> progress.getUserEmail().equals(email))
                .map(p -> {
                    repo.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody LearningProgress updatedProgress,
                                    @AuthenticationPrincipal OAuth2User principal) {
        return repo.findById(id)
                .filter(progress -> progress.getUserEmail().equals(principal.getAttribute("email")))
                .map(progress -> {
                    progress.setMessage(updatedProgress.getMessage());
                    return ResponseEntity.ok(repo.save(progress));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
