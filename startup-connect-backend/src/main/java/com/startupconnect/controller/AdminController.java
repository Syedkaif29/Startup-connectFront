package com.startupconnect.controller;

import com.startupconnect.model.User;
import com.startupconnect.model.InvestorProfile;
import com.startupconnect.model.Transaction;
import com.startupconnect.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

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
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getTransactionById(id));
    }
} 