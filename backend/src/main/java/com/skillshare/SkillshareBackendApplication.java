package com.skillshare;

import org.springframework.ai.vectorstore.mongodb.autoconfigure.MongoDBAtlasVectorStoreAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
    MongoDBAtlasVectorStoreAutoConfiguration.class
})
public class SkillshareBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillshareBackendApplication.class, args);
    }
}