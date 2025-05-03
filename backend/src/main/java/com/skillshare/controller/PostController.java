// File: PostController.java
package com.skillshare.controller;

import com.skillshare.model.Comment;
import com.skillshare.model.Like;
import com.skillshare.model.SkillPost;
import com.skillshare.repository.SkillPostRepository;
import com.skillshare.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final SkillPostRepository skillPostRepo;
    private final PostService postService;

    @GetMapping
    public List<SkillPost> getAll(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        List<SkillPost> posts = skillPostRepo.findByUserEmail(email);
        posts.sort(Comparator.comparing(SkillPost::getId).reversed()); // fallback for missing createdAt
        return posts;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePostById(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody SkillPost updatedPost, @AuthenticationPrincipal OAuth2User principal) {
        return postService.getPostById(id)
                .filter(post -> post.getUserEmail().equals(principal.getAttribute("email")))
                .map(post -> {
                    post.setDescription(updatedPost.getDescription());
                    return ResponseEntity.ok(postService.save(post));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String pic = principal.getAttribute("picture");

        Optional<Like> existing = postService.getLikesForPost(postId).stream()
                .filter(like -> like.getUserEmail().equals(email))
                .findFirst();

        if (existing.isPresent()) {
            postService.deleteLike(existing.get().getId());
        } else {
            postService.addLike(new Like(null, postId, email, name, pic));
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/likes")
    public List<Like> getLikes(@PathVariable String postId) {
        return postService.getLikesForPost(postId);
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<Comment> commentPost(@PathVariable String postId, @AuthenticationPrincipal OAuth2User principal, @RequestBody Map<String, String> payload) {
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String pic = principal.getAttribute("picture");
        String message = payload.get("text");
        Comment comment = new Comment(null, postId, email, name, pic, message, System.currentTimeMillis());
        return ResponseEntity.ok(postService.addComment(comment));
    }

    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable String postId) {
        return postService.getCommentsForPost(postId);
    }
}
