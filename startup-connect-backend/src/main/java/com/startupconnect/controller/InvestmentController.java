package com.startupconnect.controller;

import com.startupconnect.model.Investment;
import com.startupconnect.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "http://localhost:3000")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @GetMapping("/trending")
    public ResponseEntity<List<Investment>> getTrendingInvestments() {
        List<Investment> investments = investmentService.getTrendingInvestments();
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Investment> getInvestmentById(@PathVariable Long id) {
        Investment investment = investmentService.getInvestmentById(id);
        if (investment != null) {
            return ResponseEntity.ok(investment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyInvestments(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        com.startupconnect.model.User user = investmentService.getUserService().findByEmail(email);
        com.startupconnect.model.InvestorProfile investorProfile = investmentService.getInvestorProfileRepository().findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Investor profile not found for user: " + user.getId()));
        java.util.List<com.startupconnect.model.Investment> investments = investmentService.getInvestmentsByInvestor(investorProfile.getId());
        return ResponseEntity.ok(investments);
    }
} 