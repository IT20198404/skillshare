package com.skillshare.controller;

import com.skillshare.model.LearningPlan;
import com.skillshare.repository.LearningPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class LearningPlanController {

    private final LearningPlanRepository repo;

    @PostMapping
    public LearningPlan save(@RequestBody LearningPlan plan, @AuthenticationPrincipal OAuth2User principal) {
        plan.setUserEmail(principal.getAttribute("email"));
        return repo.save(plan);
    }

    @GetMapping
    public List<LearningPlan> get(@AuthenticationPrincipal OAuth2User principal) {
        return repo.findByUserEmail(principal.getAttribute("email"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return repo.findById(id)
                .filter(plan -> plan.getUserEmail().equals(email))
                .map(p -> {
                    repo.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody LearningPlan updatedPlan,
                                    @AuthenticationPrincipal OAuth2User principal) {
        return repo.findById(id)
                .filter(plan -> plan.getUserEmail().equals(principal.getAttribute("email")))
                .map(plan -> {
                    plan.setTopic(updatedPlan.getTopic());
                    plan.setResources(updatedPlan.getResources());
                    plan.setDeadline(updatedPlan.getDeadline());
                    return ResponseEntity.ok(repo.save(plan));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
