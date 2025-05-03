package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("comments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userEmail;
    private String userName;
    private String profilePicUrl;
    private String message;
    private long timestamp;
}