package com.startupconnect.repository;

import com.startupconnect.model.InvestorActivity;
import com.startupconnect.model.InvestorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvestorActivityRepository extends JpaRepository<InvestorActivity, Long> {
    List<InvestorActivity> findByInvestorOrderByActivityDateDesc(InvestorProfile investor);
    List<InvestorActivity> findByInvestorAndStatusOrderByActivityDateDesc(InvestorProfile investor, String status);
    List<InvestorActivity> findByInvestorAndActivityDateBetweenOrderByActivityDateDesc(
        InvestorProfile investor, LocalDateTime startDate, LocalDateTime endDate);
} 