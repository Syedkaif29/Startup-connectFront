package com.startupconnect.repository;

import com.startupconnect.model.Investment;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.StartupProfile;
import com.startupconnect.model.InvestmentOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByInvestor(InvestorProfile investor);
    List<Investment> findByOffer_Startup(StartupProfile startup);
    List<Investment> findByOffer(InvestmentOffer offer);
    List<Investment> findByInvestorId(Long investorId);
} 