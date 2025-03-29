package com.startupconnect.repository;

import com.startupconnect.model.InvestorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestorProfileRepository extends JpaRepository<InvestorProfile, Long> {
    InvestorProfile findByUserId(Long userId);
} 