package com.startupconnect.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.startupconnect.model.InvestmentOffer;
import com.startupconnect.model.StartupProfile;
import com.startupconnect.model.User;
import com.startupconnect.model.UserRole;
import com.startupconnect.repository.StartupProfileRepository;
import com.startupconnect.service.InvestmentOfferService;
import com.startupconnect.service.UserService;

@RestController
@RequestMapping("/api/startups/{startupId}/offers")
public class InvestmentOfferController {

    private final InvestmentOfferService investmentOfferService;
    private final UserService userService;
    private final StartupProfileRepository startupProfileRepository;

    public InvestmentOfferController(
            InvestmentOfferService investmentOfferService,
            UserService userService,
            StartupProfileRepository startupProfileRepository) {
        this.investmentOfferService = investmentOfferService;
        this.userService = userService;
        this.startupProfileRepository = startupProfileRepository;
    }

    @PostMapping
    public ResponseEntity<InvestmentOffer> createOffer(@PathVariable Long startupId, @RequestBody InvestmentOffer offer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(auth.getName());
        
        if (currentUser == null || currentUser.getRole() != UserRole.STARTUP) {
            return ResponseEntity.status(403).build();
        }
        
        StartupProfile startup = startupProfileRepository.findById(startupId)
            .orElseThrow(() -> new RuntimeException("Startup not found"));
            
        if (!startup.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(investmentOfferService.createOffer(startupId, offer));
    }

    @PutMapping("/{offerId}")
    public ResponseEntity<InvestmentOffer> updateOffer(@PathVariable Long startupId, @PathVariable Long offerId, @RequestBody InvestmentOffer offer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(auth.getName());
        
        if (currentUser == null || currentUser.getRole() != UserRole.STARTUP) {
            return ResponseEntity.status(403).build();
        }
        
        StartupProfile startup = startupProfileRepository.findById(startupId)
            .orElseThrow(() -> new RuntimeException("Startup not found"));
            
        if (!startup.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(investmentOfferService.updateOffer(startupId, offerId, offer));
    }

    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long startupId, @PathVariable Long offerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(auth.getName());
        
        if (currentUser == null || currentUser.getRole() != UserRole.STARTUP) {
            return ResponseEntity.status(403).build();
        }
        
        StartupProfile startup = startupProfileRepository.findById(startupId)
            .orElseThrow(() -> new RuntimeException("Startup not found"));
            
        if (!startup.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        investmentOfferService.deleteOffer(startupId, offerId);
        return ResponseEntity.ok().build();
    }
} 