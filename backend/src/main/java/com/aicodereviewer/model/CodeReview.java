package com.aicodereviewer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CODE_REVIEWS")
public class CodeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String language;

    @Column(name = "code_snippet", nullable = false, columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(nullable = false)
    private Integer score;

    @ElementCollection
    @CollectionTable(name = "review_issues", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "issue", columnDefinition = "TEXT")
    private List<String> issues;

    @ElementCollection
    @CollectionTable(name = "review_suggestions", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private List<String> suggestions;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public CodeReview() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public List<String> getIssues() { return issues; }
    public void setIssues(List<String> issues) { this.issues = issues; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
