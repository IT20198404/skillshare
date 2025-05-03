package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
    @Id
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicUrl;
}
