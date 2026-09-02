package com.examly.springapp.service;

import com.examly.springapp.dto.CommunityRequest;
import com.examly.springapp.entity.Community;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public Community create(CommunityRequest req, Long managerId) {
        Community community = new Community();
        community.setName(req.getName());
        community.setDescription(req.getDescription());
        community.setPrivate(req.isPrivate());
        community.setManagerId(managerId);
        community.setMemberCount(1);
        community.setStatus(Community.Status.ACTIVE);
        return communityRepository.save(community);
    }

    public List<Community> discover() {
        return communityRepository.findAll();
    }

    public Community getById(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + id));
    }

    public Community join(Long id) {
        Community community = getById(id);
        community.setMemberCount(community.getMemberCount() + 1);
        return communityRepository.save(community);
    }
}
