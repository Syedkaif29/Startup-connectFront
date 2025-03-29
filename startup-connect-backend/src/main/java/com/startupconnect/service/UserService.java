package com.startupconnect.service;

import com.startupconnect.model.User;
import com.startupconnect.model.StartupProfile;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.repository.UserRepository;
import com.startupconnect.repository.StartupProfileRepository;
import com.startupconnect.repository.InvestorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StartupProfileRepository startupProfileRepository;
    
    @Autowired
    private InvestorProfileRepository investorProfileRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public StartupProfile saveStartupProfile(StartupProfile profile) {
        return startupProfileRepository.save(profile);
    }

    public InvestorProfile saveInvestorProfile(InvestorProfile profile) {
        return investorProfileRepository.save(profile);
    }

    public StartupProfile getStartupProfileById(Long startupProfileId) {
        return startupProfileRepository.findById(startupProfileId)
            .orElseThrow(() -> new RuntimeException("Startup profile not found with id: " + startupProfileId));
    }
} 