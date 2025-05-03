package com.skillshare.repository;

import com.skillshare.model.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserEmail(String userEmail);
}