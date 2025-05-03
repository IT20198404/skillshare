package com.skillshare.service;

import com.skillshare.model.SkillPost;
import com.skillshare.repository.SkillPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final SkillPostRepository skillPostRepository;

    public boolean deletePostById(String id) {
        if (skillPostRepository.existsById(id)) {
            skillPostRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<SkillPost> getPostById(String id) {
        return skillPostRepository.findById(id);
    }

    public SkillPost save(SkillPost post) {
        return skillPostRepository.save(post);
    }
}
