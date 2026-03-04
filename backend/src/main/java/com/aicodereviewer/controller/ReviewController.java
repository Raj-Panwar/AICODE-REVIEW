package com.aicodereviewer.controller;

import com.aicodereviewer.dto.ReviewRequest;
import com.aicodereviewer.model.CodeReview;
import com.aicodereviewer.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/code")
    public ResponseEntity<?> submitCode(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            CodeReview review = reviewService.submitReview(request, userDetails.getUsername());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<CodeReview>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CodeReview> history = reviewService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            CodeReview review = reviewService.getReviewById(id, userDetails.getUsername());
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
