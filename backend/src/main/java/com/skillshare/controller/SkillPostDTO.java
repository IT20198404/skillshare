// File: src/main/java/com/skillshare/controller/SkillPost.java (if DTO is needed)
package com.skillshare.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillPostDTO {
    private String description;
    private String category;
}
