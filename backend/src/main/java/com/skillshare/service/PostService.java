package com.skillshare.service;

import com.skillshare.model.SkillPost;
import com.skillshare.model.Like;
import com.skillshare.model.Comment;
import com.skillshare.repository.SkillPostRepository;
import com.skillshare.repository.LikeRepository;
import com.skillshare.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final SkillPostRepository skillPostRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

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
        return skillPostRepository.save(post);
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
        likeRepository.deleteById(likeId);  // <-- This fixes your error
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }
}
