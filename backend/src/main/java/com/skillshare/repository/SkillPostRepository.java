package com.skillshare.repository;

import com.skillshare.model.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    List<SkillPost> findByUserEmail(String userEmail);
}
