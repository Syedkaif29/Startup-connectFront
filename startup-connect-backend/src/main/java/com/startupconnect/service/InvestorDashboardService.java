package com.startupconnect.service;

import com.startupconnect.model.InvestorActivity;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.Investment;
import com.startupconnect.repository.InvestorActivityRepository;
import com.startupconnect.repository.InvestmentRepository;
import com.startupconnect.repository.InvestorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InvestorDashboardService {

    @Autowired
    private InvestorActivityRepository activityRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private InvestorProfileRepository investorProfileRepository;

    @Autowired
    private UserService userService;

    public List<InvestorActivity> getRecentActivities(Long investorId) {
        InvestorProfile investor = userService.getInvestorProfileByUserId(investorId);
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return activityRepository.findByInvestorAndActivityDateBetweenOrderByActivityDateDesc(
            investor, thirtyDaysAgo, LocalDateTime.now());
    }

    public Map<String, BigDecimal> getSectorDistribution(Long investorId) {
        InvestorProfile investor = userService.getInvestorProfileByUserId(investorId);
        List<Investment> investments = investmentRepository.findByInvestorId(investorId);

        // Group investments by sector and calculate total amount
        Map<String, BigDecimal> sectorDistribution = investments.stream()
            .collect(Collectors.groupingBy(
                investment -> investment.getOffer().getStartup().getIndustry(),
                Collectors.reducing(BigDecimal.ZERO, Investment::getAmount, BigDecimal::add)
            ));

        // Calculate percentages
        BigDecimal totalInvestment = sectorDistribution.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (totalInvestment.compareTo(BigDecimal.ZERO) > 0) {
            sectorDistribution.replaceAll((sector, amount) -> 
                amount.divide(totalInvestment, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100)));
        }

        return sectorDistribution;
    }

    public Map<String, Object> getDashboardStats(Long investorId) {
        InvestorProfile investor = userService.getInvestorProfileByUserId(investorId);
        List<Investment> investments = investmentRepository.findByInvestorId(investorId);

        Map<String, Object> stats = new HashMap<>();
        
        // Total investment
        BigDecimal totalInvestment = investments.stream()
            .map(Investment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalInvestment", totalInvestment);

        // Number of investments
        stats.put("numberOfInvestments", investments.size());

        // Number of startups
        long uniqueStartups = investments.stream()
            .map(investment -> investment.getOffer().getStartup().getId())
            .distinct()
            .count();
        stats.put("numberOfStartups", uniqueStartups);

        // Average investment size
        if (!investments.isEmpty()) {
            stats.put("averageInvestment", 
                totalInvestment.divide(BigDecimal.valueOf(investments.size()), 2, BigDecimal.ROUND_HALF_UP));
        } else {
            stats.put("averageInvestment", BigDecimal.ZERO);
        }

        return stats;
    }

    public BigDecimal getTotalInvestmentAmount(Long investorId) {
        List<Investment> investments = investmentRepository.findByInvestorId(investorId);
        return investments.stream()
                .map(Investment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getNumberOfInvestments(Long investorId) {
        return investmentRepository.findByInvestorId(investorId).size();
    }

    public BigDecimal getAverageReturn(Long investorId) {
        List<Investment> investments = investmentRepository.findByInvestorId(investorId);
        if (investments.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal totalReturn = investments.stream()
                .map(investment -> investment.getOffer().getEquityPercentage())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        return totalReturn.divide(BigDecimal.valueOf(investments.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    public List<Investment> getRecentInvestments(Long investorId) {
        return investmentRepository.findByInvestorId(investorId).stream()
                .limit(5)
                .collect(Collectors.toList());
    }
} 