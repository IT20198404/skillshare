// File: src/main/java/com/skillshare/repository/NotificationRepository.java
package com.skillshare.repository;

import com.skillshare.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserEmailOrderByTimestampDesc(String userEmail);
}
