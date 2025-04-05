package com.startupconnect.service;

import com.startupconnect.model.InvestorProfile;
import com.startupconnect.repository.InvestorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestorService {

    @Autowired
    private InvestorProfileRepository investorProfileRepository;

    public List<InvestorProfile> getAllInvestors() {
        return investorProfileRepository.findAll();
    }

    public InvestorProfile getInvestorById(Long id) {
        return investorProfileRepository.findById(id).orElse(null);
    }
} 