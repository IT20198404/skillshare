package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "skillPost")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillPost {
    @Id
    private String id;

    private String userEmail;
    private String description;
    private List<String> mediaUrls;
}
