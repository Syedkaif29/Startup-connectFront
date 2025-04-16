package com.startupconnect.controller;

import com.startupconnect.model.InvestorActivity;
import com.startupconnect.model.Investment;
import com.startupconnect.service.InvestorDashboardService;
import com.startupconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investor/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class InvestorDashboardController {

    @Autowired
    private InvestorDashboardService dashboardService;

    @Autowired
    private UserService userService;

    @GetMapping("/activities")
    public ResponseEntity<?> getRecentActivities() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long investorId = userService.findByEmail(authentication.getName()).getId();
            List<InvestorActivity> activities = dashboardService.getRecentActivities(investorId);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sector-distribution")
    public ResponseEntity<?> getSectorDistribution() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long investorId = userService.findByEmail(authentication.getName()).getId();
            Map<String, BigDecimal> distribution = dashboardService.getSectorDistribution(investorId);
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long investorId = userService.findByEmail(authentication.getName()).getId();
            Map<String, Object> stats = dashboardService.getDashboardStats(investorId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/total-investment/{investorId}")
    public ResponseEntity<BigDecimal> getTotalInvestmentAmount(@PathVariable Long investorId) {
        return ResponseEntity.ok(dashboardService.getTotalInvestmentAmount(investorId));
    }

    @GetMapping("/number-of-investments/{investorId}")
    public ResponseEntity<Integer> getNumberOfInvestments(@PathVariable Long investorId) {
        return ResponseEntity.ok(dashboardService.getNumberOfInvestments(investorId));
    }

    @GetMapping("/average-return/{investorId}")
    public ResponseEntity<BigDecimal> getAverageReturn(@PathVariable Long investorId) {
        return ResponseEntity.ok(dashboardService.getAverageReturn(investorId));
    }

    @GetMapping("/recent-investments/{investorId}")
    public ResponseEntity<List<Investment>> getRecentInvestments(@PathVariable Long investorId) {
        return ResponseEntity.ok(dashboardService.getRecentInvestments(investorId));
    }
} 