package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LearningProgress {
    @Id
    private String id;
    private String userEmail;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
}