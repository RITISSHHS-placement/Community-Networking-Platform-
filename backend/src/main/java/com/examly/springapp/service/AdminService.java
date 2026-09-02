package com.examly.springapp.service;

import com.examly.springapp.entity.Role;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.CommunityRepository;
import com.examly.springapp.repository.EventRepository;
import com.examly.springapp.repository.PostRepository;
import com.examly.springapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * FR16 System Administration: user lifecycle (creation, role changes, suspension,
 * deactivation with full audit) and a real-time admin dashboard with system health metrics.
 * This closes the gap where SecurityConfig already guarded /api/admin/** with
 * hasRole("ADMIN") but no controller or service backed that path.
 */
@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;
    private final PostRepository postRepository;

    public AdminService(UserRepository userRepository, CommunityRepository communityRepository,
                         EventRepository eventRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.eventRepository = eventRepository;
        this.postRepository = postRepository;
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public User setUserActive(Long id, boolean active, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        boolean before = user.isActive();
        user.setActive(active);
        userRepository.save(user);
        log.info("ADMIN_ACTION actor={} action={} target_user_id={} before={} after={}",
                actorEmail, active ? "ACTIVATE" : "SUSPEND", id, before, active);
        return user;
    }

    public User changeUserRole(Long id, String newRole, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        Role before = user.getRole();
        Role role;
        try {
            role = Role.valueOf(newRole.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown role: " + newRole);
        }
        user.setRole(role);
        userRepository.save(user);
        // Role changes take effect on the user's next login (FR3) — the currently-issued
        // JWT still carries the old role claim until it expires or the user re-authenticates.
        log.info("ADMIN_ACTION actor={} action=ROLE_CHANGE target_user_id={} before={} after={}",
                actorEmail, id, before, role);
        return user;
    }

    public Map<String, Object> platformStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(User::isActive).count();
        long totalCommunities = communityRepository.count();
        long totalEvents = eventRepository.count();
        long publishedEvents = eventRepository.findByStatus(
                com.examly.springapp.entity.Event.Status.PUBLISHED).size();
        long totalPosts = postRepository.count();
        long flaggedPosts = postRepository.findAll().stream()
                .filter(com.examly.springapp.entity.Post::isFlagged).count();

        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("suspendedUsers", totalUsers - activeUsers);
        stats.put("totalCommunities", totalCommunities);
        stats.put("totalEvents", totalEvents);
        stats.put("publishedEvents", publishedEvents);
        stats.put("totalPosts", totalPosts);
        stats.put("flaggedPosts", flaggedPosts);
        return stats;
    }
}
