package com.skillshare.service;

import com.skillshare.repository.SkillPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SkillPostService {

    private final SkillPostRepository skillPostRepository;

    public boolean deleteSkillPostById(String id) {
        if (skillPostRepository.existsById(id)) {
            skillPostRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
