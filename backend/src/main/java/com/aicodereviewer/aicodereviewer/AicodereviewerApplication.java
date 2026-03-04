package com.aicodereviewer.aicodereviewer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.aicodereviewer")
@EntityScan(basePackages = "com.aicodereviewer.model")
@EnableJpaRepositories(basePackages = "com.aicodereviewer.repository")
public class AicodereviewerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AicodereviewerApplication.class, args);
	}

}
