package com.aicodereviewer.service;

import com.aicodereviewer.dto.ReviewRequest;
import com.aicodereviewer.model.CodeReview;
import com.aicodereviewer.model.User;
import com.aicodereviewer.repository.ReviewRepository;
import com.aicodereviewer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("unchecked")
    public CodeReview submitReview(ReviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Map<String, Object> aiResult = geminiService.analyzeCode(request.getLanguage(), request.getCode());

        CodeReview review = new CodeReview();
        review.setUserId(user.getId());
        review.setLanguage(request.getLanguage());
        review.setCodeSnippet(request.getCode());
        review.setScore((Integer) aiResult.get("score"));
        review.setIssues((List<String>) aiResult.get("issues"));
        review.setSuggestions((List<String>) aiResult.get("suggestions"));

        return reviewRepository.save(review);
    }

    public List<CodeReview> getHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public CodeReview getReviewById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        CodeReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));

        if (!review.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied.");
        }
        return review;
    }
}
