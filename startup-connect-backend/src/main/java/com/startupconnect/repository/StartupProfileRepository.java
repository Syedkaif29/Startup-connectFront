package com.startupconnect.repository;

import com.startupconnect.model.StartupProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StartupProfileRepository extends JpaRepository<StartupProfile, Long> {
    StartupProfile findByUserId(Long userId);
} 