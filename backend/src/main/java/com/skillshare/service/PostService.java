package com.skillshare.service;

import com.skillshare.model.SkillPost;
import com.skillshare.model.Like;
import com.skillshare.model.Comment;
import com.skillshare.model.Notification;
import com.skillshare.model.UserProfile;
import com.skillshare.repository.SkillPostRepository;
import com.skillshare.repository.LikeRepository;
import com.skillshare.repository.CommentRepository;
import com.skillshare.repository.UserProfileRepository;
import com.skillshare.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final SkillPostRepository skillPostRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;
    private final UserProfileRepository userProfileRepository;

    public boolean deletePostById(String id) {
        if (skillPostRepository.existsById(id)) {
            skillPostRepository.deleteById(id);
            likeRepository.deleteByPostId(id);
            commentRepository.deleteByPostId(id);
            return true;
        }
        return false;
    }

    public Optional<SkillPost> getPostById(String id) {
        return skillPostRepository.findById(id);
    }

    public SkillPost save(SkillPost post) {
        SkillPost saved = skillPostRepository.save(post);

        // Notify all users except the one who posted
        List<String> allUserEmails = userProfileRepository.findAll().stream()
                .map(UserProfile::getEmail)
                .filter(email -> !email.equals(post.getUserEmail()))
                .collect(Collectors.toList());

        notificationService.createNotificationForAllUsers(
                "New skill post from " + post.getUserEmail(), allUserEmails
        );

        return saved;
    }

    public List<Like> getLikesForPost(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Like addLike(Like like) {
        return likeRepository.save(like);
    }

    public void deleteLike(String likeId) {
        likeRepository.deleteById(likeId);
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }
}
