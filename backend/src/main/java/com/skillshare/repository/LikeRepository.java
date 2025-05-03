package com.skillshare.repository;

import com.skillshare.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    void deleteByPostId(String postId);  // <-- Add this line
}
