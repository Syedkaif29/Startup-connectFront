package com.startupconnect.service;

import com.startupconnect.model.PitchDeck;
import com.startupconnect.model.StartupProfile;
import com.startupconnect.repository.PitchDeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PitchDeckService {
    
    @Autowired
    private PitchDeckRepository pitchDeckRepository;
    
    @Autowired
    private UserService userService;

    public PitchDeck uploadPitchDeck(Long startupProfileId, MultipartFile file, String title, String description) {
        StartupProfile startupProfile = userService.getStartupProfileById(startupProfileId);
        
        // Get the latest version number
        List<PitchDeck> existingDecks = pitchDeckRepository.findByStartupProfileIdOrderByVersionDesc(startupProfileId);
        Integer latestVersion = existingDecks.isEmpty() ? 1 : existingDecks.get(0).getVersion() + 1;
        
        // TODO: Implement file upload to cloud storage (e.g., AWS S3)
        String fileUrl = "https://storage.example.com/pitch-decks/" + file.getOriginalFilename();
        
        PitchDeck pitchDeck = new PitchDeck();
        pitchDeck.setStartupProfile(startupProfile);
        pitchDeck.setTitle(title);
        pitchDeck.setDescription(description);
        pitchDeck.setFileUrl(fileUrl);
        pitchDeck.setFileType(file.getContentType());
        pitchDeck.setFileSize(file.getSize());
        pitchDeck.setVersion(latestVersion);
        
        return pitchDeckRepository.save(pitchDeck);
    }

    public List<PitchDeck> getPitchDecksByStartup(Long startupProfileId) {
        return pitchDeckRepository.findByStartupProfileId(startupProfileId);
    }

    public PitchDeck getLatestPitchDeck(Long startupProfileId) {
        List<PitchDeck> pitchDecks = pitchDeckRepository.findByStartupProfileIdOrderByVersionDesc(startupProfileId);
        return pitchDecks.isEmpty() ? null : pitchDecks.get(0);
    }
} 