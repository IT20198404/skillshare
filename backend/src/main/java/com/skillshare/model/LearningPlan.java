package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LearningPlan {
    @Id
    private String id;
    private String userEmail;
    private String topic;
    private String resources;
    private LocalDate deadline;
}