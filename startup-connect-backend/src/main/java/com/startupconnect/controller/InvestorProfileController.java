package com.startupconnect.controller;

import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.User;
import com.startupconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investor-profile")
@CrossOrigin(origins = "http://localhost:3000")
public class InvestorProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getInvestorProfile(@PathVariable Long userId) {
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.findByEmail(authentication.getName());

            // Check if user is requesting their own profile
            if (currentUser.getId().equals(userId)) {
                InvestorProfile profile = userService.getInvestorProfileByUserId(userId);
                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.badRequest().body("You can only access your own profile");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateInvestorProfile(@PathVariable Long userId, @RequestBody InvestorProfile profile) {
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.findByEmail(authentication.getName());

            // Check if user is updating their own profile
            if (currentUser.getId().equals(userId)) {
                InvestorProfile existingProfile = userService.getInvestorProfileByUserId(userId);
                existingProfile.setInvestorName(profile.getInvestorName());
                existingProfile.setDescription(profile.getDescription());
                existingProfile.setInvestmentFocus(profile.getInvestmentFocus());
                existingProfile.setMinimumInvestment(profile.getMinimumInvestment());
                
                InvestorProfile updatedProfile = userService.saveInvestorProfile(existingProfile);
                return ResponseEntity.ok(updatedProfile);
            } else {
                return ResponseEntity.badRequest().body("You can only update your own profile");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 