package com.startupconnect.controller;

import com.startupconnect.model.InvestorProfile;
import com.startupconnect.service.InvestorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investors")
@CrossOrigin(origins = "http://localhost:3000")
public class InvestorController {

    @Autowired
    private InvestorService investorService;

    @GetMapping
    public ResponseEntity<List<InvestorProfile>> getAllInvestors() {
        List<InvestorProfile> investors = investorService.getAllInvestors();
        return ResponseEntity.ok(investors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestorProfile> getInvestorById(@PathVariable Long id) {
        InvestorProfile investor = investorService.getInvestorById(id);
        if (investor != null) {
            return ResponseEntity.ok(investor);
        }
        return ResponseEntity.notFound().build();
    }
} 