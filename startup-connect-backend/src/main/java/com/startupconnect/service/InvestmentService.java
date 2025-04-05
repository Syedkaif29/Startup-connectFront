package com.startupconnect.service;

import com.startupconnect.model.Investment;
import com.startupconnect.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    public List<Investment> getTrendingInvestments() {
        // For now, just return all investments
        // In a real application, you would implement logic to determine trending investments
        return investmentRepository.findAll();
    }

    public Investment getInvestmentById(Long id) {
        return investmentRepository.findById(id).orElse(null);
    }
} 