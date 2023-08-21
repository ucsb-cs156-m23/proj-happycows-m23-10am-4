package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.errors.UserHiddenException;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@Tag(name="User information (admin only)")
@RequestMapping("/api/admin")
@RestController
public class UsersController extends ApiController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Get a list of all users (including hidden users)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<String> users()
            throws JsonProcessingException {
        Iterable<User> users = userRepository.findAll();
        String body = mapper.writeValueAsString(users);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Hide a specific user (including hidden ones)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/user/hide", produces = "application/json")
    public ResponseEntity<String> hideUser(
        // @Parameter(name="commonsId") @RequestParam Long commonsId) throws Exception {
        @Parameter(name="userId") @RequestParam Long userId
    ) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException(User.class, userId));
        user.setHidden(true);
        userRepository.save(user);
        return ResponseEntity.ok().body("User " + userId + " has been hidden");
    }

    @Operation(summary = "Unhide a specific user (including hidden ones)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/user/unhide")
    public ResponseEntity<String> unhideUser(
        @Param("userId") Long userId
    ) throws JsonProcessingException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException(User.class, userId));
        user.setHidden(false);
        userRepository.save(user);
        return ResponseEntity.ok().body("User " + userId + " has been unhidden");
    }
}