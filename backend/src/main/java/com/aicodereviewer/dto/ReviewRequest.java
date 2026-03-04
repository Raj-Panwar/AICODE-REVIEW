package com.aicodereviewer.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewRequest {
    @NotBlank
    private String language;

    @NotBlank
    private String code;

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
