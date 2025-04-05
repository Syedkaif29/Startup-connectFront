package com.startupconnect.service;

import com.startupconnect.model.StartupProfile;
import com.startupconnect.repository.StartupProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StartupService {

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    public List<StartupProfile> getAllStartups() {
        return startupProfileRepository.findAll();
    }

    public StartupProfile getStartupById(Long id) {
        return startupProfileRepository.findById(id).orElse(null);
    }
} 