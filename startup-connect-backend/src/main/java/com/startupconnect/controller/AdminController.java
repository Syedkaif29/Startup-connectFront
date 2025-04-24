package com.startupconnect.controller;

import com.startupconnect.model.User;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.Transaction;
import com.startupconnect.dto.TransactionDTO;
import com.startupconnect.service.AdminService;
import com.startupconnect.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private TransactionService transactionService;

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(adminService.updateUser(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // Investor management endpoints
    @GetMapping("/investors")
    public ResponseEntity<List<InvestorProfile>> getAllInvestors() {
        return ResponseEntity.ok(adminService.getAllInvestors());
    }

    @GetMapping("/investors/{id}")
    public ResponseEntity<InvestorProfile> getInvestorById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getInvestorById(id));
    }

    @PutMapping("/investors/{id}")
    public ResponseEntity<InvestorProfile> updateInvestor(@PathVariable Long id, @RequestBody InvestorProfile investor) {
        return ResponseEntity.ok(adminService.updateInvestor(id, investor));
    }

    @DeleteMapping("/investors/{id}")
    public ResponseEntity<Void> deleteInvestor(@PathVariable Long id) {
        adminService.deleteInvestor(id);
        return ResponseEntity.ok().build();
    }

    // Transaction endpoints
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<Transaction> transactions = adminService.getAllTransactions();
        List<TransactionDTO> dtos = transactions.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        Transaction transaction = adminService.getTransactionById(id);
        return ResponseEntity.ok(toDTO(transaction));
    }

    private TransactionDTO toDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(t.getId());
        dto.setInvestorId(t.getInvestor() != null ? t.getInvestor().getId() : null);
        dto.setStartupId(t.getStartup() != null ? t.getStartup().getId() : null);
        dto.setAmount(t.getAmount());
        dto.setStatus(t.getStatus());
        dto.setTransactionDate(t.getTransactionDate());
        dto.setTransactionType(t.getTransactionType());
        dto.setDescription(t.getDescription());
        
        // Add investor details
        if (t.getInvestor() != null && t.getInvestor().getUser() != null) {
            dto.setInvestorName(t.getInvestor().getUser().getFullName());
            dto.setInvestorCompanyName(t.getInvestor().getCompanyName());
        }
        
        // Add startup details
        if (t.getStartup() != null) {
            dto.setStartupName(t.getStartup().getStartupName());
            dto.setStartupStage(t.getStartup().getFundingStage());
        }
        
        return dto;
    }
} 