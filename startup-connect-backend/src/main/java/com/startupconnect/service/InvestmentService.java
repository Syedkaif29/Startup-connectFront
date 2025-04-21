package com.startupconnect.service;

import com.startupconnect.model.Investment;
import com.startupconnect.model.InvestmentOffer;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.StartupProfile;
import com.startupconnect.repository.InvestmentRepository;
import com.startupconnect.repository.InvestmentOfferRepository;
import com.startupconnect.repository.InvestorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {

    @Autowired
    private com.startupconnect.service.UserService userService;

    public com.startupconnect.service.UserService getUserService() {
        return userService;
    }

    public InvestorProfileRepository getInvestorProfileRepository() {
        return investorProfileRepository;
    }

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private InvestmentOfferRepository investmentOfferRepository;

    @Autowired
    private InvestorProfileRepository investorProfileRepository;

    @Autowired
    private InvestmentOfferService investmentOfferService;

    @Transactional
    public Investment createInvestment(Long investorId, Long offerId, BigDecimal amount) {
        InvestorProfile investor = investorProfileRepository.findById(investorId)
                .orElseThrow(() -> new RuntimeException("Investor not found with id: " + investorId));

        InvestmentOffer offer = investmentOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Investment offer not found with id: " + offerId));

        if (!offer.isActive()) {
            throw new RuntimeException("Investment offer is no longer active");
        }

        if (amount.compareTo(offer.getRemainingAmount()) > 0) {
            throw new RuntimeException("Investment amount exceeds remaining amount");
        }

        Investment investment = new Investment();
        investment.setInvestor(investor);
        investment.setOffer(offer);
        investment.setAmount(amount);
        investment.setStatus(Investment.InvestmentStatus.PENDING);

        // Update the remaining amount in the offer
        investmentOfferService.updateRemainingAmount(offerId, amount);

        return investmentRepository.save(investment);
    }

    public List<Investment> getInvestmentsByInvestor(Long investorId) {
        InvestorProfile investor = investorProfileRepository.findById(investorId)
                .orElseThrow(() -> new RuntimeException("Investor not found with id: " + investorId));
        return investmentRepository.findByInvestor(investor);
    }

    public List<Investment> getInvestmentsByStartup(StartupProfile startup) {
        return investmentRepository.findByOffer_Startup(startup);
    }

    public List<Investment> getInvestmentsByOffer(Long offerId) {
        InvestmentOffer offer = investmentOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Investment offer not found with id: " + offerId));
        return investmentRepository.findByOffer(offer);
    }

    @Transactional
    public Investment updateInvestmentStatus(Long investmentId, Investment.InvestmentStatus status) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found with id: " + investmentId));

        investment.setStatus(status);
        return investmentRepository.save(investment);
    }

    public List<Investment> getTrendingInvestments() {
        return investmentRepository.findAll().stream()
                .filter(investment -> investment.getStatus() == Investment.InvestmentStatus.APPROVED)
                .sorted((i1, i2) -> i2.getCreatedAt().compareTo(i1.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public Investment getInvestmentById(Long investmentId) {
        return investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found with id: " + investmentId));
    }
} 