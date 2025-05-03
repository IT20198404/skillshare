package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("likes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Like {
    @Id
    private String id;
    private String postId;
    private String userEmail;
    private String userName;
    private String profilePicUrl;
}
