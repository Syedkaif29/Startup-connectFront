package com.startupconnect.controller;

import com.startupconnect.model.PitchDeck;
import com.startupconnect.service.PitchDeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pitch-decks")
@CrossOrigin(origins = "http://localhost:3000")
public class PitchDeckController {

    @Autowired
    private PitchDeckService pitchDeckService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPitchDeck(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startupProfileId") Long startupProfileId) {
        try {
            PitchDeck pitchDeck = pitchDeckService.uploadPitchDeck(startupProfileId, file, title, description);
            return ResponseEntity.ok(pitchDeck);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/startup/{startupProfileId}")
    public ResponseEntity<List<PitchDeck>> getPitchDecksByStartup(@PathVariable Long startupProfileId) {
        List<PitchDeck> pitchDecks = pitchDeckService.getPitchDecksByStartup(startupProfileId);
        return ResponseEntity.ok(pitchDecks);
    }

    @GetMapping("/startup/{startupProfileId}/latest")
    public ResponseEntity<?> getLatestPitchDeck(@PathVariable Long startupProfileId) {
        PitchDeck pitchDeck = pitchDeckService.getLatestPitchDeck(startupProfileId);
        return pitchDeck != null ? ResponseEntity.ok(pitchDeck) : ResponseEntity.notFound().build();
    }
} 