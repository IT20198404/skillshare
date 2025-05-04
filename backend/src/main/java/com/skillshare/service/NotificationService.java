// File: src/main/java/com/skillshare/service/NotificationService.java
package com.skillshare.service;

import com.skillshare.model.Notification;
import com.skillshare.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotificationForAllUsers(String message, List<String> userEmails) {
        long timestamp = System.currentTimeMillis();
        for (String email : userEmails) {
            Notification notification = new Notification(null, message, email, timestamp, false);
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getNotifications(String userEmail) {
        return notificationRepository.findByUserEmailOrderByTimestampDesc(userEmail);
    }
}
