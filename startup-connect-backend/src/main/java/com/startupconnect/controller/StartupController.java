package com.startupconnect.controller;

import com.startupconnect.model.StartupProfile;
import com.startupconnect.service.StartupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/startups")
@CrossOrigin(origins = "http://localhost:3000")
public class StartupController {

    @Autowired
    private StartupService startupService;

    @GetMapping
    public ResponseEntity<List<StartupProfile>> getAllStartups() {
        List<StartupProfile> startups = startupService.getAllStartups();
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupProfile> getStartupById(@PathVariable Long id) {
        StartupProfile startup = startupService.getStartupById(id);
        if (startup != null) {
            return ResponseEntity.ok(startup);
        }
        return ResponseEntity.notFound().build();
    }
} 