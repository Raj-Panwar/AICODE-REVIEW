package com.aicodereviewer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeCode(String language, String code) {
        try {
            String prompt = buildPrompt(language, code);
            String requestBody = buildRequestBody(prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
            }

            return parseGeminiResponse(response.body());

        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze code: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String language, String code) {
        return String.format("""
            You are a senior software engineer and expert code reviewer.
            Analyze the following %s code and respond ONLY with a valid JSON object (no markdown, no extra text).
            
            The JSON must follow this exact structure:
            {
              "score": <integer 0-100>,
              "issues": ["issue1", "issue2", ...],
              "suggestions": ["suggestion1", "suggestion2", ...]
            }
            
            Analyze for:
            1. Bugs and possible runtime errors
            2. Performance issues
            3. Security vulnerabilities
            4. Best practice violations
            5. Code quality concerns
            
            Code to analyze:
            %s
            """, language, code);
    }

    private String buildRequestBody(String prompt) throws Exception {
        Map<String, Object> body = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        body.put("contents", List.of(content));

        // Set generation config to ensure clean JSON output
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.2);
        body.put("generationConfig", generationConfig);

        return objectMapper.writeValueAsString(body);
    }

    private Map<String, Object> parseGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String text = root
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text").asText();

        // Strip markdown code blocks if present
        text = text.trim();
        if (text.startsWith("```")) {
            text = text.replaceAll("```[a-z]*\\n?", "").replaceAll("```", "").trim();
        }

        JsonNode resultNode = objectMapper.readTree(text);

        Map<String, Object> result = new HashMap<>();
        result.put("score", resultNode.path("score").asInt(50));

        List<String> issues = new ArrayList<>();
        if (resultNode.has("issues")) {
            resultNode.path("issues").forEach(n -> issues.add(n.asText()));
        }
        result.put("issues", issues);

        List<String> suggestions = new ArrayList<>();
        if (resultNode.has("suggestions")) {
            resultNode.path("suggestions").forEach(n -> suggestions.add(n.asText()));
        }
        result.put("suggestions", suggestions);

        return result;
    }
}
