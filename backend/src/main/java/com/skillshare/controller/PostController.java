// File: PostController.java
package com.skillshare.controller;

import com.skillshare.model.Comment;
import com.skillshare.model.Like;
import com.skillshare.model.SkillPost;
import com.skillshare.repository.SkillPostRepository;
import com.skillshare.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    private final SkillPostRepository skillPostRepo;
    private final PostService postService;

    @GetMapping
    public List<SkillPost> getAll(@AuthenticationPrincipal OAuth2User principal) {
        List<SkillPost> posts = skillPostRepo.findAll();
        posts.forEach(post -> {
            List<Like> likes = postService.getLikesForPost(post.getId());
            List<Comment> comments = postService.getCommentsForPost(post.getId());
            post.setLikes(likes);
            post.setComments(comments);
        });
        posts.sort(Comparator.comparing(SkillPost::getId).reversed());
        return posts;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) List<MultipartFile> mediaFiles,
            @AuthenticationPrincipal OAuth2User principal) {

        List<String> mediaUrls = new ArrayList<>();

        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                try {
                    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get("uploads", filename);
                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, file.getBytes());
                    mediaUrls.add("/uploads/" + filename);
                } catch (IOException e) {
                    return ResponseEntity.internalServerError().body("File upload failed");
                }
            }
        }

        SkillPost post = new SkillPost();
        post.setDescription(description);
        post.setMediaUrls(mediaUrls);
        post.setUserEmail(principal.getAttribute("email"));

        return ResponseEntity.ok(postService.save(post));
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
        String message = payload.get("message");
        Comment comment = new Comment(null, postId, email, name, pic, message, System.currentTimeMillis());
        return ResponseEntity.ok(postService.addComment(comment));
    }

    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable String postId) {
        return postService.getCommentsForPost(postId);
    }
}
