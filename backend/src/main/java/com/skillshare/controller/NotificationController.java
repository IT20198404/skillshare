// File: src/main/java/com/skillshare/controller/NotificationController.java
package com.skillshare.controller;

import com.skillshare.model.Notification;
import com.skillshare.service.NotificationService;
import com.skillshare.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserProfileRepository userProfileRepository;

    @GetMapping
    public List<Notification> getNotifications(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return notificationService.getNotifications(email);
    }
}
